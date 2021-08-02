import { prisma, Prisma } from '../services/prisma'
import { BadgeItemOrderByInput, BadgeItem } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'

export const findBadgeItem = async (
  id: string,
  include?: Prisma.BadgeItemInclude
): Promise<BadgeItem> => {
  const badgeItem = await prisma.badgeItem.findUnique({
    where: {
      id,
    },
    include,
  })

  if (!badgeItem) {
    throw new GraphQLError('Invalid badgeType id')
  } else {
    return badgeItem
  }
}

export const badgeItemLikeCount = (badgeItemId: string):  Promise<number> => {
  return prisma.badgeItemLike.count({
    where: {
      badgeItemId,
    },
  })
}

export const badgeItemViewCount = (badgeItemId: string):  Promise<number> => {
  return prisma.badgeItemView.count({
    where: {
      badgeItemId,
    },
  })
}

export const updateBadgeItem = async (id: string, data: Prisma.BadgeItemUpdateInput):  Promise<BadgeItem> => {
  return await prisma.badgeItem.update({
    where: {
      id,
    },
    data,
  })
}

export const findManyBadgeItems = async (
  where: Prisma.BadgeItemWhereInput,
  orderBy?: BadgeItemOrderByInput
):  Promise<BadgeItem[]> => {
  return await prisma.badgeItem.findMany({
    where,
    orderBy: orderBy || { createdAt: 'desc' },
  })
}
