import { FollowStatus, Follow } from '.prisma/client'
import { GraphQLError } from 'graphql'
import prisma from '../../services/prisma'
import { Uid } from '../../types/user'
import { unFollow, upsertNewFollow } from '../database/follow.repo'
import { findProfile } from '../database/profile.repo'

interface FollowInput {
  uid: Uid
  followUserId: Uid
}

export const isUserAlreadyFollowed = async ({
  uid,
  followUserId,
}: FollowInput): Promise<boolean> => {
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
  const updatedFollow = await upsertNewFollow(followUserId, uid)

  const profile = await findProfile(uid)

  if (profile?.username) {
    // todo: notifcation is turned off temporarly
    // await sendNotificationToFollowedUser(profile?.username, followUserId)
  }

  return updatedFollow
}

const removeFollower = async ({ uid, followUserId }: FollowInput) => {
  return await unFollow(followUserId, uid)
}

export const toggleFollow = async (followUserId: string, uid: Uid): Promise<Follow> => {
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
