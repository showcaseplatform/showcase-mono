import Boom from 'boom'
import { firestore as db } from '../../services/firestore'
import { UnreadDocument, UnreadDocumentData } from '../../types/notificaton'
import { Uid } from '../../types/user'

export const getUnreadCount = async (uid: Uid): Promise<UnreadDocument> => {
  const unreadDoc = await db
    .collection('users')
    .doc(uid)
    .collection('notifications')
    .doc('unread')
    .get()

  if (!unreadDoc.exists) throw Boom.notFound('Notification document doesnt exists')

  return {
    ...(unreadDoc.data() as UnreadDocumentData),
    updateTime: unreadDoc.updateTime,
  } as UnreadDocument
}
