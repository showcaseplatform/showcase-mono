import Boom from 'boom'
import { NotificationName } from '../types/notificaton'
import { Uid } from '../types/user'
import { notificationCenter } from './notificationCenter'

export const sendNotificationToFollowedUser = async (username: string, followerUid: Uid) => {
  if (username) {
    const title = `@${username} followed you`
    const body = ''

    await notificationCenter.sendPushNotificationBatch([
      {
        name: NotificationName.NEW_FOLLOWER_ADDED,
        uid: followerUid,
        title,
        body,
      },
    ])
  } else {
    throw Boom.badData('Send notifcation failed, username is missing')
  }
}
