import { NotificationDocumentData } from '../../types/notificaton'
import { firestore as db } from '../../services/firestore'
import Boom from 'boom'
import { Uid } from '../../types/user'

export const getAllNotifications = async ({
  uid,
  lastCreatedDate,
}: {
  uid: Uid
  lastCreatedDate: string | undefined | any
}): Promise<NotificationDocumentData[]> => {
  const notificationsQuery = db
    .collection('users')
    .doc(uid)
    .collection('notifications')
    .orderBy('createdDate', 'desc')

  if (lastCreatedDate) {
    notificationsQuery.startAfter(lastCreatedDate)
  }

  const notificationsCollection = await notificationsQuery.limit(10).get()

  if (notificationsCollection.empty) throw Boom.notFound('User doesnt have any notifications')

  return notificationsCollection.docs.map((doc) => {
    return {
      ...(doc.data() as NotificationDocumentData),
    }
  })
}
