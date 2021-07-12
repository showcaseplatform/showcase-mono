import { transferWise } from '../../config'
import axios from 'axios'

import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { User, WithdrawalCreateInput } from '@generated/type-graphql'
import prisma from '../../services/prisma'
import { GraphQLError } from 'graphql'
import { Currency, Transferwise } from '@prisma/client'
import { Uid } from '../../types/user'
import {
  WITHDRAW_DEFAULT_LIMIT,
  WITHDRAW_KYC_LIMIT,
  WITHDRAW_MIN_AMOUNT,
} from '../../consts/businessRules'
import { WithdrawFromTransferwiseInput } from './types/withdrawFromTransferwise.type'

interface TransferInput {
  quote: string
  customerTransactionId: string
  targetAccount: string
}

const updateUserBalance = async (
  { currency, amount }: WithdrawFromTransferwiseInput,
  user: User
) => {
  return await prisma.balance.update({
    where: { id: user.id },
    data: { [currency]: { increment: amount } },
  })
}

const headers = {
  Authorization: `Bearer ${transferWise.token}`,
}

const validateUserFinancialInfo = async (
  { currency, amount }: WithdrawFromTransferwiseInput,
  user: User
) => {
  // todo: maybe re-calculate balance at this point?
  const userBalance = await prisma.balance.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!userBalance) {
    throw new GraphQLError('User doesnt have a balance')
  }

  // todo: unit test this
  const recentWithdrawals = await prisma.withdrawal.findMany({
    where: {
      ownerId: user.id,
      currency,
      createdAt: {
        gt: moment().add(-24, 'hours').toDate(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const recentWithdrawalsAmount = recentWithdrawals.reduce((acc, curr) => acc + curr.amount, 0)

  if (
    (!user.kycVerified && amount + recentWithdrawalsAmount > WITHDRAW_DEFAULT_LIMIT) ||
    (user.kycVerified && amount + recentWithdrawalsAmount > WITHDRAW_KYC_LIMIT)
  ) {
    throw new GraphQLError('Please contact Showcase support to increase your withdrawal limits.')
  } else if (
    amount < WITHDRAW_MIN_AMOUNT ||
    !userBalance[currency] ||
    userBalance[currency] < amount
  ) {
    throw new GraphQLError('Invalid payout amount')
  }
}

const getTransferwiseQuoteId = async ({ currency, amount }: WithdrawFromTransferwiseInput) => {
  const quoteResponse = await axios({
    method: 'post',
    url: 'https://api.sandbox.transferwise.tech/v1/quotes',
    data: {
      profile: transferWise.profile,
      source: 'EUR',
      target: currency,
      rateType: 'FIXED',
      targetAmount: amount,
      type: 'BALANCE_PAYOUT',
    },
    headers,
  })

  if (quoteResponse?.data?.id) {
    return quoteResponse.data.id as string
  } else {
    throw new GraphQLError('Invalid withdrawal amount')
  }
}

const getUserAccount = async (currency: Currency, id: Uid) => {
  const transferwiseInfo = await prisma.transferwise.findUnique({ where: { id } })
  const transferwiseId =
    transferwiseInfo && (transferwiseInfo[`id${currency}` as keyof Transferwise] as string)

  if (transferwiseInfo && transferwiseId) {
    return transferwiseId
  } else {
    throw new GraphQLError('Tranferwise account not found')
  }
}

const executeTransfer = async ({ quote, customerTransactionId, targetAccount }: TransferInput) => {
  const transferResponse = await axios({
    method: 'post',
    url: 'https://api.sandbox.transferwise.tech/v1/transfers',
    data: {
      customerTransactionId,
      quote,
      targetAccount,
      details: {
        reference: 'Showcase',
        transferPurpose: 'verification.transfers.purpose.other',
        transferPurposeOther: 'Showcase Payout',
        sourceOfFunds: 'verification.source.of.funds.other',
        sourceOfFundsOther: 'Showcase badge sales',
      },
    },
    headers,
  })

  if (transferResponse?.data?.id) {
    return transferResponse?.data?.id as string
  } else {
    throw new GraphQLError(
      transferResponse.data.errorCode || 'Transferwise transfers failed to response'
    )
  }
}

const checkIfTransactionCompleted = async (transactionId: string) => {
  const fundResponse = await axios({
    method: 'post',
    url:
      'https://api.sandbox.transferwise.tech/v3/profiles/' +
      transferWise.profile +
      '/transfers/' +
      transactionId +
      '/payments',
    data: {
      type: 'BALANCE',
    },
    headers,
  })

  if (fundResponse?.data?.status !== 'COMPLETED') {
    throw new GraphQLError(
      fundResponse.data.errorCode || 'Error processing payment to your account'
    )
  }
}

const getEstimatedDeliveryDate = async (transactionId: string) => {
  const etaResponse = await axios({
    method: 'get',
    url: 'https://api.sandbox.transferwise.tech/v1/delivery-estimates/' + transactionId,
    headers,
  })

  if (etaResponse?.data?.estimatedDeliveryDate) {
    return new Date(etaResponse.data.estimatedDeliveryDate)
  } else {
    console.log('No estimated delivery date was found for: ', { transactionId })
  }
}

export const withdrawFromTransferwise = async (
  { currency, amount }: WithdrawFromTransferwiseInput,
  user: User
) => {
  await validateUserFinancialInfo({ currency, amount }, user)

  const quote = await getTransferwiseQuoteId({ currency, amount })

  const targetAccount = await getUserAccount(currency, user.id)

  const updatedBalance = await updateUserBalance({ currency, amount: -amount }, user)

  const customerTransactionId = uuidv4()

  const withdrawalData: WithdrawalCreateInput = {
    owner: {
      connect: {
        id: user.id,
      },
    },
    customerTransactionId,
    quote,
    targetAccount,
    amount,
    currency,
    success: true,
  }

  try {
    if (updatedBalance[currency] < 0) {
      throw new GraphQLError('Insufficuent fund amount')
    }
    const transactionId = await executeTransfer({ quote, customerTransactionId, targetAccount })
    await checkIfTransactionCompleted(transactionId)

    withdrawalData.eta = await getEstimatedDeliveryDate(transactionId)
    withdrawalData.transactionId = transactionId
  } catch (error) {
    await updateUserBalance({ currency, amount }, user)
    ;(withdrawalData.success = false), (withdrawalData.error = error.toString())
  }

  return await prisma.withdrawal.create({ data: { ...withdrawalData } })
}
