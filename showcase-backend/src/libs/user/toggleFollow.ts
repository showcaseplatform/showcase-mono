import { FollowStatus } from '.prisma/client'
import { GraphQLError } from 'graphql'
import prisma from '../../services/prisma'
import { Uid } from '../../types/user'
import { upsertNewFollow } from '../database/follow.repo'

interface FollowInput {
  uid: Uid
  followUserId: Uid
}

export const isUserAlreadyFollowed = async ({ uid, followUserId }: FollowInput) => {
  const follow = await prisma.follow.findUnique({
    where: {
      userId_followerId: {
        userId: followUserId,
        followerId: uid,
      },
    },
  })
  return follow?.status === FollowStatus.Accepted
}

const addFriend = async ({ uid, followUserId }: FollowInput) => {
  const updatedFollow = await upsertNewFollow(uid, followUserId)

  const profile = await prisma.profile.findUnique({
    where: {
      id: uid,
    },
    select: {
      username: true,
    },
  })

  if (profile?.username) {
    // todo: notifcation is turned off temporarly
    // await sendNotificationToFollowedUser(profile?.username, followUserId)
  }

  return updatedFollow
}

const removeFollower = async ({ uid, followUserId }: { uid: Uid; followUserId: Uid }) => {
  return await prisma.follow.update({
    where: {
      userId_followerId: {
        userId: followUserId,
        followerId: uid,
      },
    },
    data: {
      status: FollowStatus.Unfollowed,
    },
  })
}

export const toggleFollow = async (followUserId: string, uid: Uid) => {
  if (followUserId === uid) {
    throw new GraphQLError('Followed user id matches your id')
  }
  const isAlreadyFollowed = await isUserAlreadyFollowed({ uid, followUserId })
  if (isAlreadyFollowed) {
    return await removeFollower({ uid, followUserId })
  } else {
    return await addFriend({ uid, followUserId })
  }
}
