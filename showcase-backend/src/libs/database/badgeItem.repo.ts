import { prisma, Prisma } from '../../services/prisma'

export const findBadgeItem = async (id: string) => {
  return await prisma.badgeItem.findUnique({
    where: {
      id,
    },
  })
}

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

export const updateBadgeItem = async (
  id: string,
  updateData:
    | (Prisma.Without<Prisma.BadgeItemUpdateInput, Prisma.BadgeItemUncheckedUpdateInput> &
        Prisma.BadgeItemUncheckedUpdateInput)
    | (Prisma.Without<Prisma.BadgeItemUncheckedUpdateInput, Prisma.BadgeItemUpdateInput> &
        Prisma.BadgeItemUpdateInput)
) => {
  return await prisma.badgeItem.update({
    where: {
      id,
    },
    data: {
      ...updateData,
    },
  })
}

