import { firestore as db } from '../../services/firestore'
import { Uid } from '../../types/user'

export const removeToken = async (uid: Uid) => {
  try {
    await db.collection('users').doc(uid).update({ notificationToken: null })
    console.log('Removed notification token')
  } catch (error) {
    console.error('removeToken failed: ', error)
    throw error
  }
}
