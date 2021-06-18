import prisma from '../../services/prisma'

export const badgeItemLikeCount = (badgeItemId: string) => {
  return prisma.badgeItemLike.count({
    where: {
      badgeItemId,
    },
  })
}

export const badgeItemViewCount = (badgeItemId: string) => {
  return prisma.badgeItemView.count({
    where: {
      badgeItemId,
    },
  })
}
