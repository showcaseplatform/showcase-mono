import Boom from 'boom'
import { firestore as db } from '../../services/firestore'
import { NotificationDocument, NotificationDocumentData } from '../../types/notificaton'
import { Uid } from '../../types/user'

export const getNotification = async ({
  uid,
  notificationId,
}: {
  uid: Uid
  notificationId: string
}): Promise<NotificationDocumentData> => {
  try {
    const notificationDoc = await db
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .doc(notificationId)
      .get()

    if (!notificationDoc.exists) throw Boom.notFound('Notification document doesnt exists')
    
    return {
      ...(notificationDoc.data() as NotificationDocumentData),
    }
  } catch (error) {
    console.error(`findNotification failed: `, { uid }, { notificationId }, error)
    throw error
  }
}
