import { blockchain } from '../../config'
import { Uid } from '../../types/user'
import { UnListBadgeForSaleInput } from './types/unlistBadgeForSale.type'
import { findBadgeItem, updateBadgeItem } from '../../database/badgeItem.repo'
import { GraphQLError } from 'graphql'
import { removeBadgeFromEscrow } from '../../services/blockchain'
import { BadgeItem } from '@generated/type-graphql'

export enum UnlistBadgeForSaleErrorMessages {
  notOnSale = 'Badge already removed from sale',
  userNotOwner = 'User doesnt match badge owner'

}

export const unlistBadgeForSale = async (
  input: UnListBadgeForSaleInput,
  uid: Uid
): Promise<BadgeItem> => {
  const { badgeItemId } = input

  const badgeItem = await findBadgeItem(badgeItemId)

  if (!badgeItem || badgeItem.ownerId !== uid) {
    throw new GraphQLError(UnlistBadgeForSaleErrorMessages.userNotOwner)
  } else if (!badgeItem.forSale) {
    throw new GraphQLError(UnlistBadgeForSaleErrorMessages.notOnSale)
  }

  // todo: remove blockchain.enabled once server is ready
  const response = blockchain.enabled
    ? await removeBadgeFromEscrow(badgeItem.tokenId)
    : { data: { success: true } }

  if (response && response.data && response.data.success) {
    return await updateBadgeItem(badgeItemId, {
      forSale: false,
      forSaleDate: null,
      salePrice: null,
      saleCurrency: null,
    })
  } else {
    throw new GraphQLError('Blockchain server gave invalid response')
  }
}
