/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { blockchain } from '../../config'
import { BadgeItemId } from '../../types/badge'
import { Uid } from '../../types/user'
import Boom from 'boom'
import { ListBadgeForSaleInput } from '../../resolvers/types/listBadgeForSaleInput'
import { BADGE_TYPE_MAX_SALE_PRICE, BADGE_TYPE_MIN_SALE_PRICE } from '../../consts/businessRules'
import prisma from '../../services/prisma'
import { BadgeType, Currency } from '.prisma/client'
import { v4 } from 'uuid'

interface BlockChainPostData {
  sig: string
  message: string
  badgeid: BadgeItemId
  badgeowner: string
  token: string
}

const addNonFungibleToEscrowWithSignatureRelay = async (input: ListBadgeForSaleInput, uid: Uid) => {
  const { sig, message, badgeItemId} = input

  const cryptoWallet = await prisma.crypto.findUnique({
    where: {
      id: uid,
    },
  })

  if (!cryptoWallet?.address) throw Boom.badData('User doesnt have crypto address')

  const postData: BlockChainPostData = {
    sig,
    message,
    badgeid: badgeItemId,
    badgeowner: cryptoWallet.address,
    token: blockchain.authToken,
  }

  const response = await axios.post(
    blockchain.server + '/addNonFungibleToEscrowWithSignatureRelay',
    postData
  )

  if (response && response.data && response.data.success) {
    return
  } else {
    throw Boom.internal('Blockchain server gave invalid response', response)
  }
}

const createResaleBadgeTypeAndUpdateBadge = async ({
  badgeItemId,
  currency,
  uid,
  price,
  originBadgeType,
}: {
  badgeItemId: BadgeItemId
  currency: Currency
  uid: Uid
  price: number
  originBadgeType: BadgeType
}) => {
  const newBadgeTypeId = v4()

  const [_, updatedBadge] = await prisma.$transaction([
    // todo: delete resaleBadgeType on purchase or handle resaleBadges separetly to badgeTypes
    // do we make a new badge sale here? probably. then we will delete the badge from user profile on purchase
    prisma.badgeType.create({
      data: {
        ...originBadgeType,
        id: newBadgeTypeId,
        uri: 'https://showcase.to/badge/' + badgeItemId,
        currency,
        price,
        resale: true,
        resallerProfileId: uid,
        supply: 1,
        shares: 0,
        soldout: false,
        removedFromShowcase: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        badgeItems: {
          // connect resaleBadgType with the actual badge
          connect: {
            id: badgeItemId,
          },
        },
      },
    }),

    prisma.badgeItem.update({
      where: {
        id: badgeItemId,
      },
      data: {
        // here we need to set forSale = true on the original badge doc
        forSale: true,
      },
    }),
  ])

  return updatedBadge
}

// todo: currency is not used from input type, should be removed if realy not neccesary
export const listBadgeForSale = async (input: ListBadgeForSaleInput, uid: Uid) => {
  const { badgeItemId, price } = input

  // todo: price validation should be done with gql class-validators
  if (
    price < BADGE_TYPE_MIN_SALE_PRICE ||
    price > BADGE_TYPE_MAX_SALE_PRICE ||
    isNaN(price) ||
    typeof price !== 'number'
  ) {
    throw Boom.badData('Invalid Price', price)
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: uid,
    },
  })

  const badge = await prisma.badgeItem.findUnique({
    where: {
      id: badgeItemId,
    },
    include: {
      badgeType: true,
    },
  })

  if (profile && badge && badge.ownerProfileId === uid) {
    await addNonFungibleToEscrowWithSignatureRelay(input, uid)
    const { badgeType } = badge
    return await createResaleBadgeTypeAndUpdateBadge({
      badgeItemId,
      price,
      uid,
      currency: profile.currency,
      originBadgeType: badgeType,
    })
  } else {
    throw Boom.preconditionFailed('User doesnt own the provided badge', { badge, uid })
  }
}
