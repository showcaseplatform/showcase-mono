import { FollowStatus } from '@prisma/client'
import { prisma } from '../../services/prisma'
import { Uid } from '../../types/user'

export const friendsCount = async (id: Uid) => {
  const followCount = await prisma.follow.count({
    where: {
      followerId: id,
      status: FollowStatus.Accepted
    }
  })

  return followCount || 0
}

export const followersCount = async (id: Uid) => {
  const followCount = await prisma.follow.count({
    where: {
      userId: id,
      status: FollowStatus.Accepted
    }
  })

  return followCount || 0
}
