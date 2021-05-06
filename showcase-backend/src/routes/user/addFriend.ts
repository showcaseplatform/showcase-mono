import { Response } from 'express'
import { sendNotificationToFollowedUser } from '../../notifications/newFollower'
import { firestore as db, FieldValue } from '../../services/firestore'
import { User, Uid } from '../../types/user'

const addNewFollowing = async (uid: Uid, followingUid: Uid) => {
  await db
    .collection('users')
    .doc(uid)
    .collection('following')
    .doc(followingUid)
    .set({ uid: followingUid, createdDate: new Date() })
}

const addNewFollower = async (uid: Uid, followingUid: Uid) => {
  await db
    .collection('users')
    .doc(followingUid)
    .collection('followers')
    .doc(uid)
    .set({ uid, createdDate: new Date() })
}

const updateFollowingCount = async (uid: Uid) => {
  db.collection('users')
    .doc(uid)
    .update({ followingCount: FieldValue.increment(1) })
}

const updateFollowersCount = async (followingUid: Uid) => {
  db.collection('users')
    .doc(followingUid)
    .update({ followersCount: FieldValue.increment(1) })
}

export const addFriend = async (req: any, res: Response) => {
  const { uid } = req.user as User
  const { userid: followingUid } = req.body.userid
  if (followingUid && uid) {
    try {
      await addNewFollowing(uid, followingUid)
      await addNewFollower(uid, followingUid)
      await updateFollowingCount(uid)
      await updateFollowersCount(followingUid)
      await sendNotificationToFollowedUser(uid, followingUid)
    } catch (error) {
      console.log('Error happened while adding new follower', error)
      return res.status(422).send({ error })
    }
  } else {
    return res.status(422).send({ error: 'Invalid user' })
  }
}
