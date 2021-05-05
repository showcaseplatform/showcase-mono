import { sendMostViewedBadgeInPeriod } from '../notifications/mostViewBadge'
import { resetNotificationTrackers } from '../notifications/resetNotificationTrackers'
import { functions } from '../services/firestore'

export const periodEndJob = functions.pubsub.schedule('30 16 * * 0').onRun(async (context) => {
  try {
    await sendMostViewedBadgeInPeriod()
    await resetNotificationTrackers()
  } catch (error) {
    console.error('periodEndJob failed: ', error)
  }
})
