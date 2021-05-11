import { firestore as db } from '../services/firestore'
import { NotificationName } from '../types/notificaton'
import { Uid, User } from '../types/user'
import { notificationCenter } from './notificationCenter'

const getFollowerDetails = async (followerUid: Uid) => {
  const userDoc = await db.collection('users').doc(followerUid).get()
  const { username = null } = userDoc.data() as User
  return { username }
}

export const sendNotificationToFollowedUser = async (uid: Uid, followerUid: Uid) => {
  const { username: followerName } = await getFollowerDetails(followerUid)

  const title = `@${followerName} followed you`
  const body = ''

  await notificationCenter.sendPushNotificationBatch([
    {
      name: NotificationName.NEW_FOLLOWER_ADDED,
      uid,
      title,
      body,
    },
  ])
}
