import prisma from '../../services/prisma'

export const badgeTypeLikeCount = async (badgeTypeId: string) => {
  return await prisma.badgeTypeLike.count({
    where: {
      badgeTypeId,
    },
  })
}

export const badgeTypeViewCount = async (badgeTypeId: string) => {
  return await prisma.badgeTypeView.count({
    where: {
      badgeTypeId,
    },
  })
}
