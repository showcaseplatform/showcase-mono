import prisma from '../../services/prisma'
import { BadgeType } from '@generated/type-graphql'
import { BadgeTypeId } from '../../types/badge'

export const isBadgeTypeSoldOut = (badgeType: BadgeType) => {
    return  badgeType.supply === badgeType.sold
}

export const isBadgeTypeRemovedFromShowcase = async (id: BadgeTypeId) => {
  const badgeTypeWithItems = await prisma.badgeType.findUnique({
    where: {
      id,
    },
    include: {
      badgeItems: true,
    },
  })

  if (!badgeTypeWithItems) {
    return false
  }

  const badgeItems = badgeTypeWithItems?.badgeItems || []

  if (badgeItems.length == 0 || !isBadgeTypeSoldOut(badgeTypeWithItems)) {
    return false
  } else {
    const validBadgeItems = badgeItems?.filter((badge) => {
      return badge.isSold === false && badge.removedFromShowcase === false
    })
    return validBadgeItems.length > 0
  }
}
