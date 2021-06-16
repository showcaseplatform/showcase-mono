import { prisma } from '../../services/prisma'
import { Uid } from '../../types/user'

export const friendsCount = async (id: Uid) => {
  const followAggregate = await prisma.follow.aggregate({
    where: {
      followerId: id,
    },
    count: {
      userId: true,
    },
  })

  return followAggregate.count.userId || 0
}

export const followersCount = async (id: Uid) => {
  const followAggregate = await prisma.follow.aggregate({
    where: {
      userId: id,
    },
    count: {
      userId: true,
    },
  })

  return followAggregate.count.userId || 0
}
