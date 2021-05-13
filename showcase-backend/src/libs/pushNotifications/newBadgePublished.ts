import { firestore as db } from '../../services/firestore'
import { NotificationInput, NotificationName } from '../../types/notificaton'
import { Follower, Uid, User } from '../../types/user'
import { notificationCenter } from './notificationCenter'

const getCreatorDetails = async (uid: Uid) => {
  const userDoc = await db.collection('users').doc(uid).get()
  const { displayName } = userDoc.data() as User
  const followersSnapshot = await db.collection('users').doc(uid).collection('followers').get()
  const followerUids: string[] = []

  followersSnapshot.docs.map((doc) => {
    const { uid } = doc.data() as Follower
    uid && followerUids.push(uid)
  })
  return { displayName, followerUids }
}

const getMessagesForFollowers = async (publisherName: string, followerUids: Uid[]) => {
  let inputMessages: NotificationInput[] = []
  for (const uid in followerUids) {
    const title = `${publisherName} just dropped a new badge! 👀`

    inputMessages.push({
      name: NotificationName.NEW_BADGE_PUBLISHED,
      uid,
      title,
    })
  }
  return inputMessages
}

export const sendNotificationToFollowersAboutNewBadge = async (creatorId: Uid) => {
  const { displayName, followerUids } = await getCreatorDetails(creatorId)
  const messages = await getMessagesForFollowers(displayName, followerUids)
  await notificationCenter.sendPushNotificationBatch(messages)
}
