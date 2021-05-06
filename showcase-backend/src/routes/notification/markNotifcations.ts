import { notificationCenter } from '../../notifications/notificationCenter'
import { firestore as db } from '../../services/firestore'
import { Uid } from '../../types/user'

export const markAsRead = async ({ uid, notificationId }: { uid: Uid; notificationId: string }) => {
  try {
    await db
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .doc(notificationId)
      .update({ read: true })

    await notificationCenter.changeUnreadCount({ uid, change: -1 })
  } catch (error) {
    console.error('markAsRead failed: ', { uid }, { notificationId }, error)
    throw error
  }
}

export const markAllAsRead = async (uid: Uid) => {
  try {
    const notificationsCollection = await db
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .where('read', '==', false)
      .get()

    if (!notificationsCollection.empty) {
      await Promise.all(
        notificationsCollection.docs.map(async (doc) => {
          await markAsRead({ uid, notificationId: doc.id })
        })
      )
    }
  } catch (error) {
    console.error('markAllAsRead failed: ', { uid }, error)
    throw error
  }
}
