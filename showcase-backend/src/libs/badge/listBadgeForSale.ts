import axios from 'axios'
import { blockchain } from '../../config'
import { BadgeItemId } from '../../types/badge'
import { Uid } from '../../types/user'
import Boom from 'boom'
import { ListBadgeForSaleInput } from './types/listBadgeForSale.type'
import { BADGE_TYPE_MAX_SALE_PRICE, BADGE_TYPE_MIN_SALE_PRICE } from '../../consts/businessRules'
import prisma from '../../services/prisma'
import { findProfile } from '../database/profile.repo'
import { findBadgeItem, updateBadgeItem } from '../database/badgeItem.repo'
import { GraphQLError } from 'graphql'

interface BlockChainPostData {
  sig: string
  message: string
  badgeid: BadgeItemId
  badgeowner: string
  token: string
}

const addNonFungibleToEscrowWithSignatureRelay = async (input: ListBadgeForSaleInput, uid: Uid) => {
  const { sig, message, badgeItemId: tokenId } = input

  const cryptoWallet = await prisma.crypto.findUnique({
    where: {
      id: uid,
    },
  })

  if (!cryptoWallet?.address) {
    throw Boom.badData('User doesnt have crypto address')
  }

  const postData: BlockChainPostData = {
    sig,
    message,
    badgeid: tokenId,
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
    throw new GraphQLError('Blockchain server gave invalid response')
  }
}

export const listBadgeForSale = async (input: ListBadgeForSaleInput, uid: Uid) => {
  const { badgeItemId, price, currency, sig, message } = input

  // todo: price validation should be done with gql class-validators
  if (
    price < BADGE_TYPE_MIN_SALE_PRICE ||
    price > BADGE_TYPE_MAX_SALE_PRICE ||
    isNaN(price) ||
    typeof price !== 'number'
  ) {
    throw new GraphQLError('Invalid Price')
  }

  const profile = await findProfile(uid)
  const badge = await findBadgeItem(badgeItemId)

  if (profile && badge && badge.ownerId === uid && badge.tokenId) {
    // todo: remove blockchain.enabled once server is ready
    blockchain.enabled &&
      (await addNonFungibleToEscrowWithSignatureRelay(
        { sig, price, message, badgeItemId: badge.tokenId },
        uid
      ))

    // todo: what is  "uri: 'https://showcase.to/badge/' + badgeItemId" used for? should we add a new one to the badgeItem or does this refer only the the badgeType?
    return await updateBadgeItem(badgeItemId, {
      forSale: true,
      salePrice: price,
      saleCurrency: currency || profile.currency,
    })
  } else {
    throw new GraphQLError('User doesnt own the provided badge')
  }
}
