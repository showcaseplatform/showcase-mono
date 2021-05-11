import { NotificationDocument, NotificationDocumentData } from '../../types/notificaton'
import { firestore as db } from '../../services/firestore'

// todo: add pagination
export const getAllNotifications = async (uid: string): Promise<NotificationDocument[]> => {
  try {
    const notificationsCollection = await db
    .collection('users')
    .doc(uid)
    .collection('notifications')
    .limit(50)
    .get()
    
    console.log({ notificationsCollection, uid })
    if (!notificationsCollection.empty) {
      return notificationsCollection.docs.map((doc) => {
        return {
          ...(doc.data() as NotificationDocumentData),
          id: doc.id,
        } as NotificationDocument
      })
    } else {
      return []
    }
  } catch (error) {
    console.error(`listAllNotifications failed`, { uid }, error)
    throw error
  }
}
