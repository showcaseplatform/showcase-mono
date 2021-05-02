import { sendSoldBadgesSummary } from '../notifications/soldBadgesSummary'
import { functions } from '../services/firestore'


export const notifyCreatorsBadgesSoldJob = functions.pubsub
  .schedule('30 16 * * 0')
  .onRun(async (context) => {
    sendSoldBadgesSummary()
  })
