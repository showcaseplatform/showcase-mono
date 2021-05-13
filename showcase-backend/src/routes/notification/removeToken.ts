import { firestore as db } from '../../services/firestore'
import { Uid } from '../../types/user'

export const removeToken = async (uid: Uid) => {
  await db.collection('users').doc(uid).update({ notificationToken: null })
}
