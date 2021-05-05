import { firestore as db } from '../services/firestore'
import { Uid } from '../types/user'

const getAllNotifiedUids = async () => {
  const trackerRef = await db.collection('notificationTrackers').get()
  let uids: Uid[] = []
  if (!trackerRef.empty) {
    trackerRef.docs.map((doc) => {
      const badgeId = doc.id
      badgeId && uids.push(badgeId)
    })
  }
  return uids
}

const deleteTrackerRecordsForUsers = async (uids: Uid[]) => {
  for (const uid of uids) {
    await db.collection('notificationTrackers').doc(uid).delete()
  }
}

export const resetNotificationTrackers = async () => {
  try {
    const uids = await getAllNotifiedUids()
    await deleteTrackerRecordsForUsers(uids)
  } catch (error) {
    console.error('resetNotificationTrackers failed: ', error)
    throw error
  }
}
