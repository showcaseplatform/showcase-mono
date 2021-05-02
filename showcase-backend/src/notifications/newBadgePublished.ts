import { firestore as db } from '../services/firestore'
import { NotificationMessageInput } from '../types/notificaton'
import { Follower, NotificationToken, Uid, User } from '../types/user'
import { notificationCenter } from './notificationCenter'

const getCreatorDetails = async (uid: Uid) => {
  const userDoc = await db.collection('users').doc(uid).get()
  const { displayName } = userDoc.data() as User
  const followersSnapshot = await db.collection('users').doc(uid).collection('followers').get()
  let followerTokens: string[] = []
  followersSnapshot.docs.map(async (doc) => {
    // todo: doc doesnt contain notification token, it would make sense to add these here
    const { uid } = doc.data() as Follower
    const { notificationToken } = await getFollowerToken(uid)
    notificationToken && followerTokens.push(notificationToken)
  })
  return { displayName, followerTokens }
}

const getFollowerToken = async (followerUid: Uid) => {
  const userDoc = await db.collection('users').doc(followerUid).get()
  const { notificationToken = '' } = userDoc.data() as User
  return { notificationToken }
}

const getMessagesForFollowers = async (publisherName: string, recipentTokens: NotificationToken[]) => {
  let messages: NotificationMessageInput[] = []
  for (const token in recipentTokens) {
    const to = token
    const title = `${publisherName} just dropped a new badge! 👀`
    if (to?.length) {
      messages.push({
        to,
        title,
      })
    }
  }
  return messages
}

// todo: limit the number of this function call to max 2 / day / user
export const sendNotificationToFollowersAboutNewBadge = async (creatorId: Uid) => {
  try {
    const { displayName, followerTokens } = await getCreatorDetails(creatorId)
    const messages = await getMessagesForFollowers(displayName, followerTokens)
    await notificationCenter.sendPushNotificationBatch(messages)
  } catch (error) {
    console.error('Notification about new follower couldnt be sent', { error })
  }
}
