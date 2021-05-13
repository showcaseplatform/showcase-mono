import { NotificationDocument, NotificationDocumentData } from '../../types/notificaton'
import { firestore as db } from '../../services/firestore'
import Boom from 'boom'
import { Uid } from '../../types/user'

export const getAllNotifications = async ({
  uid,
  lastCreatedDate,
}: {
  uid: Uid
  lastCreatedDate: string | undefined | any
}): Promise<NotificationDocument[]> => {
  const notificationsQuery = db
    .collection('users')
    .doc(uid)
    .collection('notifications')
    .orderBy('createdDate', 'desc')

  if (lastCreatedDate) {
    notificationsQuery.startAfter(lastCreatedDate)
  }

  const notificationsCollection = await notificationsQuery.limit(10).get()

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
}
