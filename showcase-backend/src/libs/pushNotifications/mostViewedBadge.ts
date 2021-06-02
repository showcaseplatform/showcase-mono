// import { FieldValue, firestore as db } from '../../services/firestore'
// import { NotificationInput, NotificationName } from '../../types/notificaton'
// import { Uid, User } from '../../types/user'
// import { notificationCenter } from './notificationCenter'

//// todo: currently this notification is not used

// const getAllUserUids = async () => {
//   const usersRef = await db.collection('users').get()
//   let userUids: string[] = []
//   if (!usersRef.empty) {
//     usersRef.docs.map((userDoc) => {
//       const { uid } = userDoc.data() as User
//       uid && userUids.push(uid)
//     })
//   }
//   return userUids
// }
// const getAllViewedBadgeIds = async () => {
//   const badgeViewsRef = await db.collection('badges').get()
//   let badgeIds: string[] = []
//   if (!badgeViewsRef.empty) {
//     badgeViewsRef.docs.map((doc) => {
//       const badgeId = doc.id
//       badgeId && badgeIds.push(badgeId)
//     })
//   }
//   return badgeIds
// }

// const getMessagesForAll = ({ uids, badgeId }: { uids: Uid[]; badgeId: string }) => {
//   let inputMessages: NotificationInput[] = []
//   for (const uid of uids) {
//     const title = `Check out the hottest badges on Showcase this week!`
//     const body = ``
//     const data = {
//       badgeId,
//     }

//     inputMessages.push({
//       name: NotificationName.MOST_VIEWED_BADGE,
//       uid,
//       title,
//       body,
//       data,
//     })
//   }
//   return inputMessages
// }

// const getMostViewedBadgeId = async () => {
//   const querySnapshot = await db.collection('badges').orderBy('periodViews', 'desc').limit(1).get()
//   if (querySnapshot.empty) {
//     throw 'Most viewed badge wasnt found'
//   }
//   return querySnapshot.docs[0].id
// }

// const resetMostViewedBadgeCount = async () => {
//   const badgeIds = await getAllViewedBadgeIds()
//   await resetViewCountForBadges(badgeIds)
// }

// const resetViewCountForBadges = async (badgeIds: string[]) => {
//   for (const id of badgeIds) {
//     await db
//       .collection('badges')
//       .doc(id)
//       .set(
//         { meta: { periodViews: 0, periodStartDate: FieldValue.serverTimestamp() } },
//         { merge: true }
//       )
//   }
// }

// export const incrementBadgeViewCount = async (badgeId: string) => {
//   await db
//     .collection('badges')
//     .doc(badgeId)
//     .set(
//       {
//         views: FieldValue.increment(1),
//         lastViewed: FieldValue.serverTimestamp(),
//         meta: {
//           periodViews: FieldValue.increment(1),
//         },
//       },
//       { merge: true }
//     )
// }

// export const sendMostViewedBadgeInPeriod = async () => {
//   const badgeId = await getMostViewedBadgeId()
//   const uids = await getAllUserUids()
//   const messages = getMessagesForAll({ uids, badgeId })
//   await notificationCenter.sendPushNotificationBatch(messages)
//   await resetMostViewedBadgeCount()
// }
