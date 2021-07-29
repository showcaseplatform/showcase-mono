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
import { findUserWithFinancialInfo } from '../../database/user.repo'
import { findBadgeType } from '../../database/badgeType.repo'
import { Currency } from '@prisma/client'
import { BadgeType, User, BadgeItem } from '@generated/type-graphql'
import { hasUserPaymentInfo, hasUserReachedSpendingLimit } from '../user/permissions'
import { findBadgeItem } from '../../database/badgeItem.repo'
import { BadgeItemId, BadgeTypeId } from '../../types/badge'

interface PurchaseBadgeTransactionInput<T> {
  buyerId: Uid
  badge: T
  payoutAmount: number
  transactionHash: string
  chargeId: string
  convertedPrice: number
  convertedCurrency: Currency
  convertedRate: number
  USDPrice: number
}
interface PurchaseBadgeTypeTransactionInput extends PurchaseBadgeTransactionInput<BadgeType> {
  newSoldAmount: number
  causeFullAmount: number
  tokenId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PurchaseBadgeItemTransactionInput extends PurchaseBadgeTransactionInput<BadgeItem> {}

export enum PurchaseErrorMessages {
  badgeAlreadyOwned = 'You already purchased this badge',
  badgeCreatedByUser = 'Creators cannot buy from own badges',
  paymentInfoMissing = 'Payment information missing',
  spendingLimitReached = 'You have reached the maximum spending limit. Please contact team@showcase.to to increase your limits.',
  transactionFailed = 'Purchase transaction failed to execute',
  outOfStock = 'Out of stock',
  missingBadgeId = 'Badge id musst be provided',
  badgeNotAvailableForPurchase = 'This badge is not available for purchase ',
}

const checkIfUserAllowedToPurchaseBadgeType = async (
  user: User,
  badgeType: BadgeType
): Promise<void> => {
  if (isBadgeTypeCreatedByUser(user.id, badgeType.creatorId)) {
    throw new GraphQLError(PurchaseErrorMessages.badgeCreatedByUser)
  }

  if (await isBadgeTypeSoldOut(badgeType)) {
    throw new GraphQLError(PurchaseErrorMessages.outOfStock)
  }

  if (await isBadgeTypeOwnedByUser(user.id, badgeType.id)) {
    throw new GraphQLError(PurchaseErrorMessages.badgeAlreadyOwned)
  }

  if (!hasUserPaymentInfo(user)) {
    throw new GraphQLError(PurchaseErrorMessages.paymentInfoMissing)
  }

  if (badgeType.price > 0 && hasUserReachedSpendingLimit(user)) {
    throw new GraphQLError(PurchaseErrorMessages.spendingLimitReached)
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

const purchaseBadgeItemTransaction = async ({
  badge,
  buyerId,
  chargeId,
  convertedPrice,
  convertedCurrency,
  convertedRate,
  transactionHash,
}: PurchaseBadgeItemTransactionInput) => {
  const { id, edition, tokenId, ownerId: sellerId, badgeTypeId } = badge || {}
  return await prisma.$transaction([
    prisma.badgeItem.update({
      where: {
        id,
      },
      data: {
        isSold: true,
        forSale: false,
        sellDate: new Date(),
      },
    }),

    prisma.badgeItem.create({
      data: {
        owner: {
          connect: {
            id: buyerId,
          },
        },
        badgeType: {
          connect: {
            id: badgeTypeId,
          },
        },
        tokenId,
        edition,
        purchaseDate: new Date(),
        receipt: {
          create: {
            buyerId,
            sellerId,
            causeId: null,
            chargeId,
            convertedPrice,
            convertedCurrency,
            convertedRate,
            transactionHash,
          },
        },
      },
    }),
  ])
}

const purchaseBadgeTypeTransaction = async ({
  buyerId,
  badge,
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
}: PurchaseBadgeTypeTransactionInput) => {
  return await prisma.$transaction([
    prisma.badgeType.update({
      where: {
        id: badge.id,
      },
      data: {
        sold: newSoldAmount,
        badgeItems: {
          create: {
            tokenId,
            owner: {
              connect: {
                id: buyerId,
              },
            },
            edition: newSoldAmount,
            purchaseDate: new Date(),
            receipt: {
              create: {
                buyerId,
                sellerId: badge.creatorId,
                causeId: badge.causeId || null,
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
          badge.causeId && causeFullAmount
            ? {
                update: {
                  [`balance${badge.currency}`]: {
                    increment: causeFullAmount,
                  },
                  numberOfContributions: {
                    increment: 1,
                  },
                },
              }
            : undefined,
      },
      include: {
        badgeItems: {
          where: {
            ownerId: buyerId,
            tokenId,
            isSold: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    }),
    // todo: updating balance not neccasary, can be calculated later
    prisma.user.update({
      where: {
        id: badge.creatorId,
      },
      data: {
        balance: {
          update: {
            [badge.currency]: {
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
const calculatePayments = async (price: number, currency: Currency, donationAmount?: number) => {
  const currenciesData = await CurrencyRateLib.getLatestExchangeRates()
  const userCurrencyRate = 1 // todo: user user's currency rate here:  currenciesData[user.profile.currency]
  const multiplier = (1 / currenciesData[currency]) * userCurrencyRate
  const calculatedPrice = parseFloat((price * multiplier).toFixed(2))

  let payoutAmount = 0
  let causeFullAmount = 0
  let USDPrice = 0

  if (price > 0) {
    const USDmultiplier = 1 / currenciesData[currency]
    USDPrice = parseFloat((price * USDmultiplier).toFixed(2))
    const totalPrice = price

    let feeMultiplier = SHOWCASE_COMMISSION_FEE_MULTIPLIER

    if (donationAmount) {
      feeMultiplier -= donationAmount
      causeFullAmount = donationAmount * totalPrice
    }
    payoutAmount = totalPrice * feeMultiplier
  }

  // todo:  uncomment this when display badges in user's currency is implemented
  // if (calculatedPrice !== displayedPrice && badgeType.price !== 0) {
  //   throw new GraphQLError('Wrong price displayed')
  // }

  // if (currenciesData[user.profile.currency] !== currencyRate) {
  //   console.log(currenciesData[user.profile.currency], currencyRate)
  //   throw new GraphQLError('Transaction currency conversion rate dont match!')
  // }

  return { payoutAmount, causeFullAmount, USDPrice, userCurrencyRate, calculatedPrice }
}

const purchaseBadgeItem = async (badgeItemId: BadgeItemId, user: User) => {
  const badgeItem = await findBadgeItem(badgeItemId, { badgeType: true })

  if (!badgeItem.isSold && badgeItem.forSale && badgeItem.badgeType) {
    await checkIfUserAllowedToPurchaseBadgeType(user, badgeItem.badgeType)
  } else {
    throw new GraphQLError(PurchaseErrorMessages.badgeNotAvailableForPurchase)
  }

  const price = badgeItem.salePrice || 0
  const currency = badgeItem.saleCurrency || Currency.USD

  const { payoutAmount, calculatedPrice, USDPrice, userCurrencyRate } =
    await calculatePayments(price, currency, undefined)

  // todo: chargeId should come from payment provider
  const chargeId = getRandomNum().toString()

  try {

    // todo: need new blockchain endpoint for transfering existing tokens
    const transactionHash = getRandomNum().toString()

    const [_, newBadgeItem] = await purchaseBadgeItemTransaction({
      buyerId: user.id,
      payoutAmount,
      badge: badgeItem,
      chargeId,
      transactionHash,
      convertedPrice: calculatedPrice,
      convertedCurrency: currency, // todo: use user.profile?.currency  for conversion
      convertedRate: userCurrencyRate,
      USDPrice,
    })

    return newBadgeItem
  } catch (error) {
    // todo: refund payment charge
    console.error({ error })
    throw new GraphQLError(PurchaseErrorMessages.transactionFailed)
  }
}

const purchaseBadgeType = async (badgeTypeId: BadgeTypeId, user: User) => {
  const badgeType = await findBadgeType(badgeTypeId)
  await checkIfUserAllowedToPurchaseBadgeType(user, badgeType)

  const price = badgeType.price
  const currency = badgeType.currency

  const { payoutAmount, calculatedPrice, USDPrice, userCurrencyRate, causeFullAmount } =
    await calculatePayments(price, currency, badgeType.donationAmount || undefined)

  // todo: chargeId should come from payment provider
  const chargeId = getRandomNum().toString()

  try {
    const newSoldAmount = badgeType.sold + 1
    const newBadgeTokenId = constructNewBadgeTokenId(badgeType, newSoldAmount)

    const transactionHash = await mintNewBadgeOnBlockchain(
      newBadgeTokenId,
      user?.cryptoWallet?.address
    )

    const [updatedBadgeType, _] = await purchaseBadgeTypeTransaction({
      buyerId: user.id,
      payoutAmount,
      causeFullAmount,
      tokenId: newBadgeTokenId,
      badge: badgeType,
      chargeId,
      transactionHash,
      convertedPrice: calculatedPrice,
      convertedCurrency: currency, // todo: use user.profile?.currency  for conversion
      convertedRate: userCurrencyRate,
      USDPrice,
      newSoldAmount,
    })

    return updatedBadgeType.badgeItems[0]
  } catch (error) {
    // todo: refund payment charge
    console.error({ error })
    throw new GraphQLError(PurchaseErrorMessages.transactionFailed)
  }
}

export const purchaseBadge = async (
  input: PurchaseBadgeInput,
  buyerId: Uid
): Promise<BadgeItem> => {
  const { badgeTypeId, badgeItemId } = input || {}
  const user = await findUserWithFinancialInfo(buyerId)
  if (badgeTypeId) {
    return await purchaseBadgeType(badgeTypeId, user)
  } else if (badgeItemId) {
    return await purchaseBadgeItem(badgeItemId, user)
  } else {
    throw new GraphQLError(PurchaseErrorMessages.missingBadgeId)
  }
}
