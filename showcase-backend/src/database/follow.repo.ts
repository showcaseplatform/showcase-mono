import { FollowStatus } from '@prisma/client'
import prisma from '../services/prisma'
import { Uid } from '../types/user'

export const upsertNewFollow = async (userId: Uid, followerId: Uid) => {
  return await prisma.follow.upsert({
    where: {
      userId_followerId: {
        userId,
        followerId,
      },
    },
    update: {
      status: FollowStatus.Accepted,
    },
    create: {
      userId,
      followerId,
      status: FollowStatus.Accepted,
    },
  })
}

export const findFollow = async (userId: Uid, followerId: Uid) => {
  return await prisma.follow.findUnique({
    where: {
      userId_followerId: {
        userId,
        followerId
      }
    }
  })
}

export const unFollow = async (userId: Uid, followerId: Uid) => {
  return await prisma.follow.update({
    where: {
      userId_followerId: {
        userId,
        followerId,
      },
    },
    data: {
      status: FollowStatus.Unfollowed,
    },
  })
}