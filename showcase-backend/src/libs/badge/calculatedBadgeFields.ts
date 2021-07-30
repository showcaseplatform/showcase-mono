import { GraphQLError } from 'graphql'
import { prisma } from '../../services/prisma'
import { BadgeItemId } from '../../types/badge'

export const getBadgeItemPurchaseDate = async (id: BadgeItemId): Promise<Date> => {
  const latestReceipt = await prisma.receipt.findFirst({
    where: {
      badgeItemId: id,
    },
    orderBy: {
        createdAt: 'desc'
    },
    take: 1
  })

  if(latestReceipt) {
      return latestReceipt.createdAt
  } else {
    throw new GraphQLError('Invalid badge, no receipt was found.')
  }
}
