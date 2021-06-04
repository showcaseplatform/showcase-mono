import { NotificationType } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { Uid } from '../../types/user'
import { notificationCenter } from './notificationCenter'

export const sendNotificationToFollowedUser = async (username: string, followerUid: Uid) => {
  if (username) {
    const title = `@${username} followed you`

    await notificationCenter.sendPushNotificationBatch([
      {
        type: NotificationType.NEW_FOLLOWER_ADDED,
        recipientId: followerUid,
        title,
        message: '',
      },
    ])
  } else {
    throw new GraphQLError('Failed to send notifcation, username is missing')
  }
}
