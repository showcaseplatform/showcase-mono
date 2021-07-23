import { GraphQLError } from 'graphql'
import prisma from '../../services/prisma'
import { BadgeTypeId } from '../../types/badge'

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

export const findBadgeType = async (id: BadgeTypeId) => {
  const badgeType = await prisma.badgeType.findUnique({
    where: {
      id,
    },
  })

  if (!badgeType) {
    throw new GraphQLError('Invalid badge id')
  } else {
    return badgeType
  }
}
