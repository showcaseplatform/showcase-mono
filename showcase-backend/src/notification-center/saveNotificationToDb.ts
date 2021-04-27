import { firestore as db } from '../services/firestore'
import { INotificationDocument, IPushNotifcationData, NotificationType } from '../types/notificaton'
import { Uid } from '../types/user'

export const saveNotificationToDb = async (
  title: string,
  body: string,
  user: Uid,
  data: IPushNotifcationData,
  type: NotificationType
) => {
  try {
    const notificationDoc: INotificationDocument = {
      title,
      body,
      user,
      createdAt: new Date(),
      data,
      read: false,
      type: type || 'normal',
    }
    await db.collection('notifications').add(notificationDoc)
  } catch (error) {}
}
