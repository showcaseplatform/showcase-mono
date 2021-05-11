import { firestore as db } from '../../services/firestore'
import { NotificationDocument, NotificationDocumentData } from '../../types/notificaton'
import { Uid } from '../../types/user'

export const getNotification = async ({
  uid,
  notificationId,
}: {
  uid: Uid
  notificationId: string
}): Promise<NotificationDocument> => {
  try {
    const notificationDoc = await db
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .doc(notificationId)
      .get()

    if (notificationDoc.exists) {
      return {
        ...(notificationDoc.data() as NotificationDocumentData),
        id: notificationDoc.id,
      } as NotificationDocument
    } else {
      throw 'Notification document doesnt exists'
    }
  } catch (error) {
    console.error(`findNotification failed: `, { uid }, { notificationId }, error)
    throw error
  }
}
