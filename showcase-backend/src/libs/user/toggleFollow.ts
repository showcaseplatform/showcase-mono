import Boom from 'boom'
import { sendNotificationToFollowedUser } from '../../libs/pushNotifications/newFollower'
import { firestore as db, FieldValue } from '../../services/firestore'
import { Uid } from '../../types/user'

interface ToggleFollowInput {
  uid: Uid
  username: string
  followingUid: Uid
}

const deleteFollowing = async (uid: Uid, followingUid: Uid) => {
  await db.collection('users').doc(uid).collection('following').doc(followingUid).delete()
}
const deleteFollower = async (uid: Uid, followingUid: Uid) => {
  await db.collection('users').doc(followingUid).collection('followers').doc(uid).delete()
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

const updateFollowingCount = async (uid: Uid, change: number) => {
  await db
    .collection('users')
    .doc(uid)
    .update({ followingCount: FieldValue.increment(change) })
}

const updateFollowersCount = async (followingUid: Uid, change: number) => {
  await db
    .collection('users')
    .doc(followingUid)
    .update({ followersCount: FieldValue.increment(change) })
}

const isUserAlreadyFollowed = async ({ uid, followingUid }: { uid: Uid; followingUid: Uid }) => {
  const followingDoc = await db
    .collection('users')
    .doc(uid)
    .collection('following')
    .doc(followingUid)
    .get()

  return followingDoc.exists
}

const addFollowing = async ({ uid, username, followingUid }: ToggleFollowInput) => {
  await addNewFollowing(uid, followingUid)
  await addNewFollower(uid, followingUid)
  await updateFollowingCount(uid, 1)
  await updateFollowersCount(followingUid, 1)
  await sendNotificationToFollowedUser(username, followingUid)
}

const removeFollowing = async ({ uid, followingUid }: { uid: Uid; followingUid: Uid }) => {
  await deleteFollowing(uid, followingUid)
  await deleteFollower(uid, followingUid)
  await updateFollowingCount(uid, -1)
  await updateFollowersCount(followingUid, -1)
}

export const toggleFollow = async ({ uid, username, followingUid }: ToggleFollowInput) => {
  if (followingUid && uid) {
    (await isUserAlreadyFollowed({ uid, followingUid }))
      ? await removeFollowing({ uid, followingUid })
      : await addFollowing({ uid, username, followingUid })
  } else {
    throw Boom.badData('Invalid user id')
  }
}
