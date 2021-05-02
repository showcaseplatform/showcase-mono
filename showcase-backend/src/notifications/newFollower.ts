import { firestore as db } from '../services/firestore'
import { NotificationToken, Uid, User } from '../types/user'
import { notificationCenter } from './notificationCenter'

const getFollowerDetails = async (followerUid: Uid) => {
  const userDoc = await db.collection('users').doc(followerUid).get()
  const { username = null } = userDoc.data() as User
  return { username }
}

const getUserToken = async (uid: Uid) => {
  const userDoc = await db.collection('users').doc(uid).get()
  const { notificationToken = null } = userDoc.data() as User
  return { notificationToken }
}

export const sendNotificationToFollowedUser = async (uid: NotificationToken, followerUid: Uid) => {
  try {
    const { notificationToken: to } = await getUserToken(uid)
    const { username: followerName } = await getFollowerDetails(followerUid)

    const title = `@${followerName} followed you`
    const body = ''

    await notificationCenter.sendPushNotification(to || '', title, body)
    console.log('Notification sent about new follower', { title })
  } catch (error) {
    console.error('Notification about new follower couldnt be sent', { error })
  }
}