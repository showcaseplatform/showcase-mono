import Boom from 'boom'
import { notificationCenter } from '../../notifications/notificationCenter'
import { firestore as db } from '../../services/firestore'
import { Uid } from '../../types/user'

export const markAsRead = async ({ uid, notificationId }: { uid: Uid; notificationId: string }) => {
  await db
    .collection('users')
    .doc(uid)
    .collection('notifications')
    .doc(notificationId)
    .update({ read: true })

  await notificationCenter.changeUnreadCount({ uid, change: -1 })
}

export const markAllAsRead = async (uid: Uid) => {
  const notificationsCollection = await db
    .collection('users')
    .doc(uid)
    .collection('notifications')
    .where('read', '==', false)
    .get()

  if (notificationsCollection.empty) throw Boom.notFound('User doesnt have any notifications')

  await Promise.all(
    notificationsCollection.docs.map(async (doc) => {
      await markAsRead({ uid, notificationId: doc.id })
    })
  )
}
