import { FieldValue, firestore as db } from '../services/firestore'
import { NotificationMessageInput, NotificationName } from '../types/notificaton'
import { Uid, User } from '../types/user'
import { notificationCenter } from './notificationCenter'

const getAllUserUids = async () => {
  const usersRef = await db.collection('users').get()
  let userUids: string[] = []
  if (!usersRef.empty) {
    usersRef.docs.map((userDoc) => {
      const { uid } = userDoc.data() as User
      uid && userUids.push(uid)
    })
  }
  return userUids
}
const getAllViewedBadgeIds = async () => {
  const badgeViewsRef = await db.collection('badgeViewsInCurrentPeriod').get()
  let badgeIds: string[] = []
  if (!badgeViewsRef.empty) {
    badgeViewsRef.docs.map((doc) => {
      const badgeId = doc.id
      badgeId && badgeIds.push(badgeId)
    })
  }
  return badgeIds
}

const deleteViewCountForBadges = async (badgeIds: string[]) => {
  for (const id of badgeIds) {
    await db.collection('badgeViewsInCurrentPeriod').doc(id).delete()
  }
}

const getMessagesForAll = ({ uids, badgeId }: { uids: Uid[]; badgeId: string }) => {
  let inputMessages: NotificationMessageInput[] = []
  for (const uid of uids) {
    const title = `Check out the hottest badges on Showcase this week!`
    const body = ``
    const data = {
      badgeId,
    }

    inputMessages.push({
      name: NotificationName.MOST_VIEWED_BADGE,
      uid,
      title,
      body,
      data,
    })
  }
  return inputMessages
}

const getMostViewedBadgeId = async () => {
  const querySnapshot = await db
    .collection('badgeViewsInCurrentPeriod')
    .orderBy('viewCount', 'desc')
    .limit(1)
    .get()
  let mostViewedBadgeId = ''
  if (!querySnapshot.empty) {
    querySnapshot.docs.map((doc) => {
      mostViewedBadgeId = doc.id
    })
  }
  return mostViewedBadgeId
}

const resetMostViewBadgeCount = async () => {
  try {
    const badgeIds = await getAllViewedBadgeIds()
    await deleteViewCountForBadges(badgeIds)
  } catch (error) {
    console.error('resetMostViewBadgeCount failed: ', error)
    throw error
  }
}

export const incrementPeriodBadgeViewCount = async (badgeId: string) => {
  try {
    await db
      .collection('badgeViewsInCurrentPeriod')
      .doc(badgeId)
      .set({ viewCount: FieldValue.increment(1) }, { merge: true })
  } catch (error) {
    console.error('trackNotification failed: ', error)
    throw error
  }
}

export const sendMostViewedBadgeInPeriod = async () => {
  try {
    const badgeId = await getMostViewedBadgeId()
    const uids = await getAllUserUids()
    const messages = getMessagesForAll({ uids, badgeId })
    await notificationCenter.sendPushNotificationBatch(messages)
    await resetMostViewBadgeCount()
  } catch (error) {
    console.error('sendMostViewedBadgeInPeriod failed: ', error)
    throw error
  }
}
