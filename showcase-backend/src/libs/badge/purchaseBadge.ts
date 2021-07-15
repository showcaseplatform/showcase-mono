import { Uid } from '../../types/user'
import { prisma } from '../../services/prisma'
import { BadgeType, Currency } from '.prisma/client'
import { SPEND_LIMIT_DEFAULT, SPEND_LIMIT_KYC_VERIFIED } from '../../consts/businessRules'
import { PurchaseBadgeInput } from './types/purchaseBadge.type'
import { GraphQLError } from 'graphql'
import { CurrencyRateLib } from '../currencyRate/currencyRate'
import { getRandomNum } from '../../utils/randoms'
import { isBadgeTypeSoldOut } from './validateBadgeType'
import { blockchain } from '../../config'
import { mintNewBadgeOnBlockchain } from '../../services/blockchain'

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

const checkIfBadgeAlreadyOwnedByUser = async (userId: Uid, badgeTypeId: string) => {
  const userWithBadgeItems = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      badgeItemsOwned: {
        where: {
          badgeTypeId,
        },
      },
    },
  })

  if (
    userWithBadgeItems?.badgeItemsOwned?.length &&
    userWithBadgeItems?.badgeItemsOwned?.length > 0
  ) {
    throw new GraphQLError('You already purchased this badge')
  }
}

// todo: why is it neccesary to construct this id? would be better to auto-gen badgeItem ids, and store this in a prop if neccesary
const constructNewBadgeTokenId = (badge: BadgeType, newSoldAmount: number) => {
  let newLastDigits = (parseInt(badge.tokenTypeId.slice(-10)) + newSoldAmount).toFixed(0)

  while (newLastDigits.length < 10) {
    newLastDigits = '0' + newLastDigits
  }

  return badge.tokenTypeId.slice(0, -10) + newLastDigits
}

const getUserProfileWithFinancialInfo = async (id: Uid) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      cryptoWallet: true,
      balance: true,
      paymentInfo: true,
    },
  })
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

  const user = await getUserProfileWithFinancialInfo(uid)

  if (!user || !user.balance) {
    throw new GraphQLError('Profile missing')
  }

  if (
    (!user.kycVerified && user.balance.totalSpentAmountConvertedUsd > SPEND_LIMIT_DEFAULT) ||
    (user.kycVerified && user.balance.totalSpentAmountConvertedUsd > SPEND_LIMIT_KYC_VERIFIED)
  ) {
    throw new GraphQLError(
      'You have reached the maximum spending limit. Please contact team@showcase.to to increase your limits.'
    )
  }

  // todo: uncomment when strip integration is tested
  // if (
  //   !user.cryptoWallet ||
  //   !user.cryptoWallet.address ||
  //   !user.balance?.id ||
  //   !user.paymentInfo?.tokenId
  // ) {
  //   throw new GraphQLError('No crypto wallet or payment information was added ')
  // }

  await checkIfBadgeAlreadyOwnedByUser(uid, badgeTypeId)

  const badgeType = await prisma.badgeType.findUnique({
    where: {
      id: badgeTypeId,
    },
  })

  if (!badgeType) {
    throw new GraphQLError('Invalid badge id')
  }

  if (isBadgeTypeSoldOut(badgeType)) {
    throw new GraphQLError('Out of stock')
  }

  const currenciesData = await CurrencyRateLib.getLatestExchangeRates()

  if (!user?.profile?.currency) {
    throw new GraphQLError('User profile currency if missing')
  }

  const userCurrencyRate = currenciesData[user.profile.currency]

  const newSoldAmount = badgeType.sold + 1
  const newBadgeTokenId = constructNewBadgeTokenId(badgeType, newSoldAmount)

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

  // todo: uncomment when strip integration is tested
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
    // todo: uncomment when strip integration is tested
    // todo: remove blockchain.enabled once server is ready
    const { transactionHash } = blockchain.enabled
      ? await mintNewBadgeOnBlockchain(newBadgeTokenId, user?.cryptoWallet?.address)
      : { transactionHash: 'fake_hash' + getRandomNum() }

    let payoutAmount = 0
    let causeFullAmount = 0
    let USDPrice = 0

    if (badgeType.price > 0) {
      const USDmultiplier = 1 / currenciesData[badgeType.currency]
      USDPrice = parseFloat((badgeType.price * USDmultiplier).toFixed(2))
      const totalPrice = badgeType.price
      // todo: why is this set to 0.9 by default?
      let feeMultiplier = 0.9

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
      convertedCurrency: user.profile.currency,
      convertedRate: userCurrencyRate,
      USDPrice,
      newSoldAmount,
    })

    return updatedBadgeType.badgeItems[0]
  } catch (error) {
    // await stripe.refundPayment(chargeId)
    console.error({ error })
    throw new GraphQLError('Purchase failed to execute')
  }
}
