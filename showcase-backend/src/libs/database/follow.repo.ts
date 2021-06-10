import { FollowStatus } from '@prisma/client'
import prisma from '../../services/prisma'
import { Uid } from '../../types/user'

export const upsertNewFollow = async (uid: Uid, friendId: Uid) => {
  return await prisma.follow.upsert({
    where: {
      userId_followerId: {
        userId: friendId,
        followerId: uid,
      },
    },
    update: {
      status: FollowStatus.Accepted,
    },
    create: {
      userId: friendId,
      followerId: uid,
      status: FollowStatus.Accepted,
    },
  })
}
