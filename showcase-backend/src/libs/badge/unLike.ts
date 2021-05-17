/* eslint-disable promise/no-nesting */
import Boom from 'boom'
import { firestore as db, FieldValue } from '../../services/firestore'
import { UnlikeRequestBody } from '../../types/badge'
import { User } from '../../types/user'

interface UnikeHandlerInput extends UnlikeRequestBody {
  user: User
}

export const unlikeHandler = async ({ marketplace, badgeid, user }: UnikeHandlerInput) => {
  if (!user.liked || !user.liked[badgeid]) {
    throw Boom.methodNotAllowed('Already unliked')
  } else {
    delete user.liked[badgeid]
    await db.collection('users').doc(user.uid).update({ liked: user.liked })
    if (marketplace) {
      await db
        .collection('badgesales')
        .doc(badgeid)
        .update({ likes: FieldValue.increment(-1) })
    } else {
      await db
        .collection('badges')
        .doc(badgeid)
        .update({ likes: FieldValue.increment(-1) })
    }
  }
}
