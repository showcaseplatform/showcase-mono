import { FollowStatus } from '.prisma/client'
import { ToggleFollowInput } from './types/toggleFollow.type'
import prisma from '../../services/prisma'
import { Uid } from '../../types/user'

interface FollowInput {
  uid: Uid
  friendId: Uid
}

const isUserAlreadyFollowed = async ({ uid, friendId }: FollowInput) => {
  const follow = await prisma.follow.findUnique({
    where: {
      userId_followerId: {
        userId: friendId,
        followerId: uid,
      },
    },
  })
  return !!follow && follow.status != FollowStatus.Unfollowed
}

const addFriend = async ({ uid, friendId }: FollowInput) => {
  const updatedFollow = await prisma.follow.update({
    where: {
      userId_followerId: {
        userId: friendId,
        followerId: uid,
      },
    },
    data: {
      // todo: currently pending state is not used, request get insatly accepted
      status: FollowStatus.Accepted,
    },
  })

  const profile= await prisma.profile.findUnique({
    where: {
      id: uid,
    },
    select: {
      username: true,
    },
  })

  if (profile?.username) {
    // todo: notifcation is turned off temporarly
    // await sendNotificationToFollowedUser(profile?.username, friendId)
  }

  return updatedFollow
}

const removeFriend = async ({ uid, friendId }: { uid: Uid; friendId: Uid }) => {
  return await prisma.follow.update({
    where: {
      userId_followerId: {
        userId: friendId,
        followerId: uid,
      },
    },
    data: {
      status: FollowStatus.Unfollowed,
    },
  })
}

export const toggleFollow = async (input: ToggleFollowInput, uid: Uid) => {
  const { friendId } = input
  const isAlreadyFollowed = await isUserAlreadyFollowed({ uid, friendId })
  if (isAlreadyFollowed) {
    return await removeFriend({ uid, friendId })
  } else {
    return await addFriend({ uid, friendId })
  }
}
