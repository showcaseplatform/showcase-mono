import { blockchain } from '../../config'
import { Uid } from '../../types/user'
import { UnListBadgeForSaleInput } from './types/unlistBadgeForSale.type'
import { findBadgeItem, updateBadgeItem } from '../database/badgeItem.repo'
import { GraphQLError } from 'graphql'
import { removeBadgeFromEscrow } from '../../services/blockchain'

export const unlistBadgeForSale = async (input: UnListBadgeForSaleInput, uid: Uid) => {
  const { badgeItemId } = input

  const badgeItem = await findBadgeItem(badgeItemId)

  // here we need to make sure user currently owns the badge because the removebadge is called from escrow
  if (!badgeItem || badgeItem.ownerId !== uid) {
    throw new GraphQLError('User doesnt match badge owner')
  } else if (!badgeItem.forSale) {
    throw new GraphQLError('Badge already on sale!')
  }

  // todo: remove blockchain.enabled once server is ready
  const response = blockchain.enabled
    ? await removeBadgeFromEscrow(badgeItem.tokenId)
    : { data: { success: true } }

  if (response && response.data && response.data.success) {
    return await updateBadgeItem(badgeItemId, {
      forSale: false,
      salePrice: null,
      saleCurrency: null,
    })
  } else {
    throw new GraphQLError('Blockchain server gave invalid response')
  }
}
