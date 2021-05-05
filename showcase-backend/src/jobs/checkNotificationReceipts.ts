import { notificationCenter } from '../notifications/notificationCenter'
import { functions } from '../services/firestore'

export const checkNotificationReceiptsJob = functions.pubsub.schedule('00 08 * * 1').onRun(async (context) => {
  try {
    await notificationCenter.searchForErrorsInTickets()
  } catch (error) {
    console.error('periodEndJob failed: ', error)
  }
})
