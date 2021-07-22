import { BadgeType } from '@generated/type-graphql'
import { BadgeTypeId } from '../../types/badge'
import { findManyBadgeItems } from '../database/badgeItem.repo'
import { Uid } from '../../types/user'

export const getAvailableToBuyCount = async (badgeType: BadgeType) => {
  const originalSupplyCount = badgeType.supply - badgeType.sold
  const itemsForSaleCount = (await findManyBadgeItems({ badgeTypeId: badgeType.id, forSale: true }))
    .length

  return originalSupplyCount + itemsForSaleCount
}

export const isBadgeTypeSoldOut = async (badgeType: BadgeType) => {
  const availableToBuyCount = await getAvailableToBuyCount(badgeType)
  return availableToBuyCount === 0
}

export const isBadgeTypeCreatedByUser = (id: Uid, creatorId: Uid) => {
  return creatorId === id
}

export const isBadgeTypeOwnedByUser = async (id: Uid, badgeTypeId: BadgeTypeId) => {
  const userWithBadgeItems = await findManyBadgeItems({ ownerId: id, badgeTypeId, isSold: false })
  return userWithBadgeItems.length > 0
}

export const isBadgeTypeRemovedFromShowcase = async (id: BadgeTypeId) => {
  const badgeItems = await findManyBadgeItems({ badgeTypeId: id })

  if (badgeItems.length === 0) {
    return false
  } else {
    const validBadgeItems = badgeItems?.filter((badge) => {
      return badge.isSold === false && badge.removedFromShowcase === false
    })
    return validBadgeItems.length === 0
  }
}
