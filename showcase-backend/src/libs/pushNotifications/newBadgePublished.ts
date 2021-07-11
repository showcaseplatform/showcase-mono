import { NotificationType } from '@prisma/client'
import { GraphQLError } from 'graphql'
import prisma from '../../services/prisma'
import { SendNotificationProps } from '../../types/notificaton'
import { Uid } from '../../types/user'
import { notificationSender } from '../notification/notificationSenderLib'

const getCreatorDetails = async (uid: Uid) => {
  const creatorProfile = await prisma.user.findUnique({
    where: {
      id: uid,
    },
    include: {
      profile: true,
      followers: true,
    },
  })

  if (!creatorProfile?.profile?.displayName) {
    throw new GraphQLError('Creator profile details werent found')
  }

  const followerUids = creatorProfile.followers.map((follow) => follow.followerId)

  return { displayName: creatorProfile.profile.displayName, followerUids }
}

const getMessagesForFollowers = (
  publisherName: string,
  followerUids: Uid[]
): SendNotificationProps[] => {
  return followerUids.map((uid) => {
    return {
      type: NotificationType.NEW_BADGE_PUBLISHED,
      recipientId: uid,
      title: `${publisherName} just dropped a new badge! 👀`,
      message: '',
    }
  })
}

export const sendNotificationToFollowersAboutNewBadge = async (creatorId: Uid) => {
  const { displayName, followerUids } = await getCreatorDetails(creatorId)
  const messages = getMessagesForFollowers(displayName, followerUids)
  await notificationSender.send(messages)
}
