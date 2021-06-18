import prisma from '../../services/prisma'

export const badgeTypeLikeCount = (badgeTypeId: string) => {
  return prisma.badgeTypeLike.count({
    where: {
      badgeTypeId,
    },
  })
}

export const badgeTypeViewCount = (badgeTypeId: string) => {
  return prisma.badgeTypeView.count({
    where: {
      badgeTypeId,
    },
  })
}
