import { functions, firestore as db } from '../services/firestore'
import { IPushNotifcationData } from '../types/notificaton'
import { Uid, IUser } from '../types/user'
import { sendPushNotification } from '../notification-center/sendPushNotification'

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

const getNotificationData = (message: string, to: Uid): IPushNotifcationData => {
  return {
    sent: new Date(),
    read: false,
    message: message,
    to,
  }
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
      const data = getNotificationData(title, to || '')
      await sendPushNotification(to || '', title, body, data)
      console.log('Notification sent about new follower', { title })
      return true
    } catch (error) {
      console.log('Notification about new follower couldnt be sent', { error })
      return false
    }
  })
