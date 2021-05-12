import Boom from 'boom'
import { sendNotificationToFollowedUser } from '../../notifications/newFollower'
import { firestore as db, FieldValue } from '../../services/firestore'
import { User, Uid } from '../../types/user'

interface AddFriendInput {
  uid: Uid
  followingUid: Uid
}

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
  await db
    .collection('users')
    .doc(uid)
    .update({ followingCount: FieldValue.increment(1) })
}

const updateFollowersCount = async (followingUid: Uid) => {
  await db
    .collection('users')
    .doc(followingUid)
    .update({ followersCount: FieldValue.increment(1) })
}

export const addFriend = async ({ uid, followingUid }: AddFriendInput) => {
  if (followingUid && uid) {
    await addNewFollowing(uid, followingUid)
    await addNewFollower(uid, followingUid)
    await updateFollowingCount(uid)
    await updateFollowersCount(followingUid)
    await sendNotificationToFollowedUser(uid, followingUid)
  } else {
    throw Boom.badData('Invalid user id')
  }
}
