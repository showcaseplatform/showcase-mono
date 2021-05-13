import Boom from 'boom'
import { firestore as db } from '../../services/firestore'
import { Uid, User } from '../../types/user'

export const getUserAvatar = async (uid: Uid) => {
  if(!uid) throw Boom.badData('Invalid uid')
  const getUser = await db.collection('users').doc(uid).get()
  const { avatar } = getUser.data() as User
  if (avatar) {
    return avatar
  } else {
    throw Boom.notFound('User doesnt have an avatar')
  }
}
