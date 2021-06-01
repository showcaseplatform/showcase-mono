import axios from 'axios'
import { blockchain } from '../../config'
import { stripe } from '../../services/stripe'
import { Uid } from '../../types/user'
import Boom from 'boom'
import { prisma } from '../../services/prisma'
import { BadgeType, Currency, User } from '.prisma/client'
import { SPEND_LIMIT_DEFAULT, SPEND_LIMIT_KYC_VERIFIED } from '../../consts/businessRules'
import { PurchaseBadgeInput } from './types/purchaseBadge.type'
import { GraphQLError } from 'graphql'

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
  const badgesOwned = await prisma.user.findUnique({
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

  if (badgesOwned?.badgeItemsOwned?.length && badgesOwned?.badgeItemsOwned?.length > 0) {
    throw new GraphQLError('You already purchased this badge')
  }
}

const getCurrencyRates = async () => {
  const currencyRates = await prisma.currencyRate.findMany()
  if (currencyRates.length > 0) {
    return currencyRates.reduce((acc, curr) => {
      acc[curr.code as Currency] = curr.rate
      return acc
    }, {} as Record<Currency, number>)
  } else {
    throw Boom.notFound('Empty currencies')
  }
}

// todo: why is it neccesary to construct this id? would be better to auto-gen badgeItem ids, and store this in a prop if neccesary
const constructNewBadgeId = (badge: BadgeType, newSoldAmount: number) => {
  let newLastDigits = (parseInt(badge.tokenTypeId.slice(-10)) + newSoldAmount).toFixed(0)

  while (newLastDigits.length < 10) {
    newLastDigits = '0' + newLastDigits
  }

  return badge.tokenTypeId.slice(0, -10) + newLastDigits
}

const mintNewBadgeOnBlockchain = async (cryptoWalletAddress: string, newBadgeTokenId: string) => {
  const data = {
    to: cryptoWalletAddress,
    type: newBadgeTokenId,
    token: blockchain.authToken,
  }

  const response = await axios.post(blockchain.server + '/mintBadge', data)

  if (response.data?.success && response.data?.transactionHash) {
    return response.data
  } else {
    throw Boom.internal('Failed to mint new badge on blockchain', response)
  }
}

const getUserProfileWithFinancialInfo = async (id: Uid) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      cryptoWallet: true,
      stripeBalance: true,
      stripeInfo: true,
    },
  })
}

const chargeStripeAccount = async ({
  amount,
  currency,
  customerStripeId,
  badgeItemId,
  title,
  creatorProfileId,
}: {
  amount: number
  currency: Currency
  customerStripeId: string
  badgeItemId: string
  title: string
  creatorProfileId: string
}) => {
  // todo: test this if its correct
  const twoDecimalCurrencyMultiplier = 100
  const charge = await stripe.charges.create({
    amount: amount * twoDecimalCurrencyMultiplier,
    currency,
    customer: customerStripeId,
    description: 'Showcase Badge "' + title + '" (ID: ' + badgeItemId + ')',
    metadata: {
      badgeid: badgeItemId,
      badgename: title,
      creatorid: creatorProfileId,
    },
    // todo: when should we include emails?
    //receipt_email: user.email || null, //avoid email for now..
  })

  if (!charge || !charge.id || !charge.paid) {
    throw Boom.internal('Unable to create charge')
  }

  return { chargeId: charge.id }
}

const executeDBTransaction = async ({
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
  await prisma.$transaction([
    prisma.badgeType.update({
      where: {
        id: badgeType.id,
      },
      data: {
        sold: newSoldAmount,
        soldout: newSoldAmount === badgeType.supply,
        badgeItems: {
          create: {
            tokenId,
            creatorId: badgeType.creatorId,
            ownerId: userId,
            edition: newSoldAmount,
            purchaseDate: new Date(),
            receipt: {
              create: {
                recipientId: userId,
                creatorId: badgeType.creatorId,
                badgeTypeId:  badgeType.id,
                stripeChargeId: chargeId,
                salePrice: badgeType.price,
                saleCurrency: badgeType.currency,
                saleDonationAmount: badgeType.donationAmount,
                causeId: badgeType.causeId,
                convertedPrice,
                convertedCurrency,
                convertedRate,
                transactionHash,
              },
            },
          },
        },
        cause: {
          update: {
            balanceEur: {
              increment: badgeType.currency === Currency.EUR ? causeFullAmount : 0,
            },
            balanceUsd: {
              increment: badgeType.currency === Currency.USD ? causeFullAmount : 0,
            },
            balanceGpb: {
              increment: badgeType.currency === Currency.GBP ? causeFullAmount : 0,
            },
          },
        },
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
    data: {
        stripeBalance: {
          update: {
            eur: {
              increment: badgeType.currency === Currency.EUR ? payoutAmount : 0,
            },
            usd: {
              increment: badgeType.currency === Currency.USD ? payoutAmount : 0,
            },
            gbp: {
              increment: badgeType.currency === Currency.GBP ? payoutAmount : 0,
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
  const { badgeTypeId, currencyRate, displayedPrice } = input

  const user = await getUserProfileWithFinancialInfo(uid)

  if (!user || !user.stripeBalance) {
    throw Boom.badData('Profile missing')
  }

  if (
    (!user.kycVerified &&
      user.stripeBalance.totalSpentAmountConvertedUsd > SPEND_LIMIT_DEFAULT) ||
    (user.kycVerified &&
      user.stripeBalance.totalSpentAmountConvertedUsd > SPEND_LIMIT_KYC_VERIFIED)
  ) {
    throw Boom.preconditionFailed(
      'You have reached the maximum spending limit. Please contact team@showcase.to to increase your limits.'
    )
  }
  if (
    !user.cryptoWallet ||
    !user.cryptoWallet.address ||
    !user.stripeBalance?.id ||
    !user.stripeInfo?.stripeId
  ) {
    throw Boom.preconditionFailed('No wallet or card')
  }

  await checkIfBadgeAlreadyOwnedByUser(uid, badgeTypeId)

  const badgeType = await prisma.badgeType.findUnique({
    where: {
      id: badgeTypeId,
    },
  })

  if (!badgeType) {
    throw new GraphQLError('Invalid badge id')
  }

  if (badgeType.sold === badgeType.supply) {
    throw new GraphQLError('Out of stock')
  }

  const currenciesData = await getCurrencyRates()

  if(!user?.profile?.currency) {
    throw new GraphQLError('User profile currency if missing')
  }

  const userCurrencyRate = currenciesData[user.profile.currency]

  const newSoldAmount = badgeType.sold + 1
  const newBadgeId = constructNewBadgeId(badgeType, newSoldAmount)

  const multiplier = (1 / currenciesData[badgeType.currency]) * userCurrencyRate
  const calculatedPrice = parseFloat((badgeType.price * multiplier).toFixed(2))

  if (calculatedPrice !== displayedPrice && badgeType.price !== 0) {
    throw new GraphQLError('Wrong price displayed')
  }

  if (currenciesData[user.profile.currency] !== currencyRate) {
    throw new GraphQLError('Transaction currency conversion rate dont match!')
  }

  const { chargeId } = await chargeStripeAccount({
    amount: calculatedPrice,
    currency: user.profile.currency,
    title: badgeType.title,
    badgeItemId: newBadgeId,
    creatorProfileId: badgeType.creatorId,
    customerStripeId: user.stripeInfo.stripeId,
  })

  try {
    const { transactionHash } = await mintNewBadgeOnBlockchain(
      user.cryptoWallet.address,
      newBadgeId
    )
    let payoutAmount = 0
    let causeFullAmount = 0
    let USDPrice = 0

    if (badgeType.price > 0) {
      let USDmultiplier = 1 / currenciesData[badgeType.currency]
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

    await executeDBTransaction({
      userId: uid,
      payoutAmount,
      causeFullAmount,
      tokenId: newBadgeId,
      badgeType,
      chargeId,
      transactionHash,
      convertedPrice: calculatedPrice,
      convertedCurrency: user.profile.currency,
      convertedRate: userCurrencyRate,
      USDPrice,
      newSoldAmount,
    })

    const badgeItem = await prisma.badgeItem.findUnique({
      where: {
        id: newBadgeId,
      },
    })
    if (badgeItem) {
      return badgeItem
    } else {
      throw new GraphQLError('Couldnt create badgeItem')
    }
  } catch (error) {
    await stripe.refunds.create({ charge: chargeId })
    throw new GraphQLError('Purchase failed to execute,')
  }
}
