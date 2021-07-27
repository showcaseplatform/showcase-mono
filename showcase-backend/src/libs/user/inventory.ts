import { Uid } from '../../types/user'
import { findManyBadgeItems } from '../database/badgeItem.repo'

export const UserBadgeItemsToShow = async (ownerId: Uid) => {
  return await findManyBadgeItems({ ownerId, forSale: false })
}

export const UserBadgeItemsForSale = async (ownerId: Uid) => {
  return await findManyBadgeItems({ ownerId, forSale: true })
}
