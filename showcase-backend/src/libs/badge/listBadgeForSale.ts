import { blockchain } from '../../config'
import { Uid } from '../../types/user'
import { ListBadgeForSaleInput } from './types/listBadgeForSale.type'
import { BADGE_TYPE_MAX_SALE_PRICE, BADGE_TYPE_MIN_SALE_PRICE } from '../../consts/businessRules'
import { findProfile } from '../../database/profile.repo'
import { findBadgeItem, updateBadgeItem } from '../../database/badgeItem.repo'
import { GraphQLError } from 'graphql'
import { addNonFungibleToEscrowWithSignatureRelay } from '../../services/blockchain'
import { BadgeItem } from '@generated/type-graphql'


export enum ListBadgeForSaleErrorMessages {
  invalidPrice = 'Invalid Price',
  userNotOwner = 'User doesnt match badge owner',
  onSale = 'Badge already on sale'
}

export const listBadgeForSale = async (input: ListBadgeForSaleInput, uid: Uid): Promise<BadgeItem> => {
  const { badgeItemId, price, currency, sig, message } = input

  // todo: price validation should be done with gql class-validators
  if (
    price < BADGE_TYPE_MIN_SALE_PRICE ||
    price > BADGE_TYPE_MAX_SALE_PRICE ||
    isNaN(price) ||
    typeof price !== 'number'
  ) {
    throw new GraphQLError(ListBadgeForSaleErrorMessages.invalidPrice)
  }

  const profile = await findProfile(uid)
  const badge = await findBadgeItem(badgeItemId)

  if(badge.forSale) {
    throw new GraphQLError(ListBadgeForSaleErrorMessages.onSale)
  }

  if (profile && badge && badge.ownerId === uid && badge.tokenId) {
    // todo: remove blockchain.enabled once server is ready
    blockchain.enabled &&
      (await addNonFungibleToEscrowWithSignatureRelay(
        { sig, price, message, badgeItemId: badge.tokenId },
        uid
      ))

    return await updateBadgeItem(badgeItemId, {
      forSale: true,
      forSaleDate: new Date(),
      salePrice: price,
      saleCurrency: currency || profile.currency,
    })
  } else {
    throw new GraphQLError(ListBadgeForSaleErrorMessages.userNotOwner)
  }
}
