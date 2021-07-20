import { Uid } from '../../types/user'
import { prisma } from '../../services/prisma'
import { SHOWCASE_COMMISSION_FEE_MULTIPLIER } from '../../consts/businessRules'
import { PurchaseBadgeInput } from './types/purchaseBadge.type'
import { GraphQLError } from 'graphql'
import { CurrencyRateLib } from '../currencyRate/currencyRate'
import { getRandomNum } from '../../utils/randoms'
import {
  isBadgeTypeCreatedByUser,
  isBadgeTypeOwnedByUser,
  isBadgeTypeSoldOut,
} from './validateBadgePurchase'
import { mintNewBadgeOnBlockchain } from '../../services/blockchain'
import { findUserWithFinancialInfo } from '../database/user.repo'
import { findBadgeType } from '../database/badgeType.repo'
import { Currency } from '@prisma/client'
import { BadgeType, User } from '@generated/type-graphql'
import { hasUserPaymentInfo, hasUserReachedSpendingLimit } from '../user/permissions'

interface PurchaseTransactionInput {
  userId: string
  badgeType: BadgeType
  newSoldAmount: number
  tokenId: string
  causeFullAmount: number
  payoutAmount: number
  transactionHash: string
  chargeId: string
  convertedPrice: number
  convertedCurrency: Currency
  convertedRate: number
  USDPrice: number
}

enum ErrorMessages {
  badgeAlreadyOwned = 'You already purchased this badge',
  badgeCreatedByUser = 'Creators cannot buy from own badges',
  paymentInfoMissing = 'Payment information missing',
  spendingLimitReached = 'You have reached the maximum spending limit. Please contact team@showcase.to to increase your limits.',
  transactionFailed = 'Purchase transaction failed to execute',
  outOfStock = 'Out of stock',
}

const checkIfUserAllowedToPurchaseBadgeType = async (
  user: User,
  badgeType: BadgeType
): Promise<void> => {
  if (isBadgeTypeCreatedByUser(user.id, badgeType.creatorId)) {
    throw new GraphQLError(ErrorMessages.badgeCreatedByUser)
  }

  if (await isBadgeTypeSoldOut(badgeType)) {
    throw new GraphQLError(ErrorMessages.outOfStock)
  }

  if (await isBadgeTypeOwnedByUser(user.id, badgeType.id)) {
    throw new GraphQLError(ErrorMessages.badgeAlreadyOwned)
  }

  if (!hasUserPaymentInfo(user)) {
    throw new GraphQLError(ErrorMessages.paymentInfoMissing)
  }

  if (badgeType.price > 0 && hasUserReachedSpendingLimit(user)) {
    throw new GraphQLError(ErrorMessages.spendingLimitReached)
  }
}

// todo: how and what for is this used for?
const constructNewBadgeTokenId = (badge: BadgeType, newSoldAmount: number) => {
  let newLastDigits = (parseInt(badge.tokenTypeId.slice(-10)) + newSoldAmount).toFixed(0)

  while (newLastDigits.length < 10) {
    newLastDigits = '0' + newLastDigits
  }

  return badge.tokenTypeId.slice(0, -10) + newLastDigits
}

const purchaseBadgeTransaction = async ({
  userId,
  badgeType,
  newSoldAmount,
  tokenId,
  causeFullAmount,
  payoutAmount,
  transactionHash,
  chargeId,
  convertedPrice,
  convertedCurrency,
  convertedRate,
  USDPrice,
}: PurchaseTransactionInput) => {
  return await prisma.$transaction([
    prisma.badgeType.update({
      where: {
        id: badgeType.id,
      },
      data: {
        sold: newSoldAmount,
        badgeItems: {
          create: {
            tokenId,
            owner: {
              connect: {
                id: userId,
              },
            },
            edition: newSoldAmount,
            purchaseDate: new Date(),
            receipt: {
              create: {
                buyerId: userId,
                sellerId: badgeType.creatorId,
                causeId: badgeType.causeId || null,
                chargeId,
                convertedPrice,
                convertedCurrency,
                convertedRate,
                transactionHash,
              },
            },
          },
        },
        cause:
          badgeType.causeId && causeFullAmount
            ? {
                update: {
                  [`balance${badgeType.currency}`]: {
                    increment: causeFullAmount,
                  },
                },
              }
            : undefined,
      },
      include: {
        badgeItems: {
          where: {
            ownerId: userId,
            tokenId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: {
          update: {
            [badgeType.currency]: {
              increment: payoutAmount || 0,
            },
            totalSpentAmountConvertedUsd: {
              increment: USDPrice,
            },
          },
        },
      },
    }),
  ])
}

export const purchaseBadge = async (input: PurchaseBadgeInput, uid: Uid) => {
  const { badgeTypeId } = input || {}

  const badgeType = await findBadgeType(badgeTypeId)
  const user = await findUserWithFinancialInfo(uid)

  await checkIfUserAllowedToPurchaseBadgeType(user, badgeType)

  const currenciesData = await CurrencyRateLib.getLatestExchangeRates()

  const userCurrencyRate = 1 // todo: user user's currency rate here:  currenciesData[user.profile.currency]
  const multiplier = (1 / currenciesData[badgeType.currency]) * userCurrencyRate
  const calculatedPrice = parseFloat((badgeType.price * multiplier).toFixed(2))

  // todo:  uncomment this when display badges in user's currency is implemented
  // if (calculatedPrice !== displayedPrice && badgeType.price !== 0) {
  //   throw new GraphQLError('Wrong price displayed')
  // }

  // if (currenciesData[user.profile.currency] !== currencyRate) {
  //   console.log(currenciesData[user.profile.currency], currencyRate)
  //   throw new GraphQLError('Transaction currency conversion rate dont match!')
  // }

  const newSoldAmount = badgeType.sold + 1
  const newBadgeTokenId = constructNewBadgeTokenId(badgeType, newSoldAmount)

  // todo: uncomment when stripe integration is tested
  // const { chargeId } = await stripe.chargeStripeAccount({
  //   amount: calculatedPrice,
  //   currency: user.profile.currency,
  //   title: badgeType.title,
  //   badgeItemId: newBadgeTokenId,
  //   creatorProfileId: badgeType.creatorId,
  //   customerStripeId: user.paymentInfo.tokenId,
  // })
  const chargeId = getRandomNum().toString()

  try {
    const transactionHash = await mintNewBadgeOnBlockchain(
      newBadgeTokenId,
      user?.cryptoWallet?.address
    )

    let payoutAmount = 0
    let causeFullAmount = 0
    let USDPrice = 0

    if (badgeType.price > 0) {
      const USDmultiplier = 1 / currenciesData[badgeType.currency]
      USDPrice = parseFloat((badgeType.price * USDmultiplier).toFixed(2))
      const totalPrice = badgeType.price

      let feeMultiplier = SHOWCASE_COMMISSION_FEE_MULTIPLIER

      if (badgeType.donationAmount) {
        feeMultiplier -= badgeType.donationAmount
        causeFullAmount = badgeType.donationAmount * totalPrice
      }
      payoutAmount = totalPrice * feeMultiplier
    }

    const [updatedBadgeType, _] = await purchaseBadgeTransaction({
      userId: uid,
      payoutAmount,
      causeFullAmount,
      tokenId: newBadgeTokenId,
      badgeType,
      chargeId,
      transactionHash,
      convertedPrice: calculatedPrice,
      convertedCurrency: badgeType.currency, // todo: use user.profile?.currency  for conversion
      convertedRate: userCurrencyRate,
      USDPrice,
      newSoldAmount,
    })

    return updatedBadgeType.badgeItems[0]
  } catch (error) {
    // await stripe.refundPayment(chargeId)
    console.error({ error })
    throw new GraphQLError(ErrorMessages.transactionFailed)
  }
}
