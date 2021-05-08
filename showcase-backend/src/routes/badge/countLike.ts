/* eslint-disable promise/no-nesting */
import Boom from 'boom'
import { firestore as db, FieldValue } from '../../services/firestore'
import { CountLikeRequestBody } from '../../types/badge'
import { User } from '../../types/user'

interface CountLikeHandlerInput extends CountLikeRequestBody {
  user: User
}

export const countLikeHandler = async ({ marketplace, badgeid, user }: CountLikeHandlerInput) => {
  try {
    if (user.liked && user.liked[badgeid]) {
      throw Boom.methodNotAllowed('Already liked')
    } else {
      user.liked[badgeid] = true
      await db.collection('users').doc(user.uid).update({ liked: user.liked })
      if (marketplace) {
        await db
          .collection('badgesales')
          .doc(badgeid)
          .update({ likes: FieldValue.increment(1) })
      } else {
        await db
          .collection('badges')
          .doc(badgeid)
          .update({ likes: FieldValue.increment(1) })
      }
    }
  } catch (error) {
    console.error('countLikeHandler failed: ', { error })
    throw error
  }
}
