import { functions, firestore as db } from '../services/firestore'
import { Uid, IUser } from '../types/user'
import { NotificationCenter } from '../services/notificationCenter'

const getFollowerDetails = async (followerUid: Uid) => {
  const userDoc = await db.collection('users').doc(followerUid).get()
  const { username = null } = userDoc.data() as IUser
  return { username }
}

const getUserToken = async (uid: Uid) => {
  const userDoc = await db.collection('users').doc(uid).get()
  const { notificationToken = null } = userDoc.data() as IUser
  return { notificationToken }
}

export const followerCreateTrigger = functions.firestore
  .document('users/{uid}/followers/{followerId}')
  .onCreate(async (snap, context) => {
    try {
      const { uid: followerUid } = snap.data()
      const { uid } = context.params
      const { notificationToken: to } = await getUserToken(uid)
      const { username: followerName } = await getFollowerDetails(followerUid)

      const title = `@${followerName} followed you`
      const body = ''

      const notificationLib = new NotificationCenter()
      await notificationLib.sendPushNotification(to || '', title, body)

      console.log('Notification sent about new follower', { title })
    } catch (error) {
      console.error('Notification about new follower couldnt be sent', { error })
    }
  })
