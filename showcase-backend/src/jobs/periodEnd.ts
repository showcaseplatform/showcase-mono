import {
  resetMostViewBadgeCount,
  sendMostViewedBadgeInPeriod,
} from '../notifications/mostViewBadge'
import { functions } from '../services/firestore'

export const periodEndJob = functions.pubsub
  .schedule('30 16 * * 0')
  .onRun(async (context) => {
    try {
      await sendMostViewedBadgeInPeriod()
    } catch (error) {
      console.error('periodEndJob failed: ', error)
    }
  })
