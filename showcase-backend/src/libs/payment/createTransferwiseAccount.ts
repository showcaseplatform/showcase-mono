import { transferWise as transferWiseConfig } from '../../config'
import axios from 'axios'
import { Transferwise, Currency, User } from '@generated/type-graphql'
import prisma from '../../services/prisma'
import { GraphQLError } from 'graphql'
import { PayoutAccountInput } from './types/payoutAccount.type'


const sendDataToTransferwise = async (inputData: any) => {
  const url = 'https://api.sandbox.transferwise.tech/v1/accounts'
  const legalType = 'PRIVATE'

  const { data } = await axios({
    method: 'post',
    url,
    data: {
      profile: transferWiseConfig.profile,
      ownedByCustomer: true,
      ...inputData,
      details: {
        legalType,
        ...inputData.details,
      },
    },
    headers: {
      Authorization: `Bearer ${transferWiseConfig.token}`,
    },
  })

  if (data && data?.id) {
    return data.id as string
  } else {
    throw new GraphQLError('Transferwise response doesnt contain neccesary data')
  }
}

const upsertTranferwiseInfo = async (upsertData: Partial<Transferwise>, user: User) => {
  let saveData: any = {}
  for (const [key, value] of Object.entries(upsertData)) {
    if (value) {
      saveData[key] = value
    }
  }
  const transferwiseInfo = await prisma.transferwise.upsert({
    where: {
      id: user.id,
    },
    create: {
      id: user.id,
      ...saveData,
    },
    update: {
      ...saveData,
    },
  })

  console.log('Transferwise info upserted: ', { transferwiseInfo })
}

const createRecipientUSD = async (
  {
    currency,
    accountHolderName,
    routingNumber,
    accountNumber,
    accountType,
    city,
    country,
    firstLine,
    postCode,
  }: PayoutAccountInput
) => {
  const tranferwiseData = {
    currency,
    type: 'aba',
    accountHolderName,
    details: {
      abartn: routingNumber,
      accountNumber,
      accountType,
      city,
      address: {
        country: country || 'US',
        firstLine,
        postCode,
      },
    },
  }

  const id = await sendDataToTransferwise(tranferwiseData)
  return {idUSD: id, accountNumberUSD: accountNumber }
}

const createRecipientGBP = async (
  { currency, accountHolderName, accountNumber, sortCode }: PayoutAccountInput
) => {
  const tranferwiseData = {
    currency,
    type: 'sort_code',
    accountHolderName,
    details: {
      sortCode,
      accountNumber,
    },
  }
  const id = await sendDataToTransferwise(tranferwiseData)
  return { idGBP: id, accountNumberGBP: accountNumber }
}

const createRecipientEUR = async (
  { currency, accountHolderName, accountNumber, iban }: PayoutAccountInput
) => {
  const tranferwiseData = {
    currency,
    type: 'iban',
    accountHolderName,
    details: {
      //BIC:req.body.bic, //todo: why is this commented out?
      IBAN: iban,
    },
  }
  const id = await sendDataToTransferwise(tranferwiseData)
  return { idEUR: id, accountNumberEUR: accountNumber }
}

export const createTransferwiseAccount = async (input: PayoutAccountInput, user: User) => {
  const { currency } = input
  let accountData: Partial<Transferwise>

  if (currency === Currency.USD) {
    accountData = await createRecipientUSD(input)
  } else if (currency === Currency.GBP) {
    accountData = await createRecipientGBP(input)
  } else if (currency === Currency.EUR) {
    accountData = await createRecipientEUR(input)
  } else {
    throw new GraphQLError('Invalid currency')
  }

  await upsertTranferwiseInfo(accountData, user)
  
  return 'Succesfully executed transferwise payout account'
}
