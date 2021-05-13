import { firestore as db } from '../../services/firestore'
import { UnreadDocumentData } from '../../types/notificaton'
import { Uid } from '../../types/user'

export const getUnreadCount = async (uid: Uid): Promise<UnreadDocumentData> => {
  const unreadDoc = await db
    .collection('users')
    .doc(uid)
    .collection('notifications')
    .doc('unread')
    .get()

  if (unreadDoc.exists) {
    return {
      ...unreadDoc.data(),
    } as UnreadDocumentData
  } else {
    return { count: 0 } as UnreadDocumentData
  }
}
