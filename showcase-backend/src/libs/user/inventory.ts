import { Uid } from '../../types/user'
import { findUserBadgeItems } from '../database/badgeItem.repo'

export const UserBadgeItemsToShow = async (ownerId: Uid) => {
  return await findUserBadgeItems({ ownerId, forSale: false }, { createdAt: 'desc' })
}

export const UserBadgeItemsForSale = async (ownerId: Uid) => {
  return await findUserBadgeItems({ ownerId, forSale: true }, { createdAt: 'desc' })
}
