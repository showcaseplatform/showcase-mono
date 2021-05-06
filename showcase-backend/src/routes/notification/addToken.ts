import { firestore as db } from '../../services/firestore'
import { Uid } from '../../types/user'

export const addToken = async ({
  uid,
  notificationToken,
}: {
  uid: Uid
  notificationToken: string
}) => {
  try {
    await db.collection('users').doc(uid).update({ notificationToken })
  } catch (error) {
    console.error('addToken failed: ', error)
    throw error
  }
}

