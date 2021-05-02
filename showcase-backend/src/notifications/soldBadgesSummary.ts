import { firestore as db } from '../services/firestore'
import moment from 'moment'
import { IReceipt } from '../types/receipt'
import { User, Uid } from '../types/user'
import { NotificationMessageInput } from '../types/notificaton'
import { notificationCenter } from './notificationCenter'

interface IBadgesSoldRecordValue {
  USD: number
  GBP: number
  EUR: number
  count: number
}

const getAllReceiptsFromLastWeek = async (db: FirebaseFirestore.Firestore) => {
  const periodStartDate = moment().add(-7, 'days').toDate()
  console.log({ periodStartDate })
  const receiptsSnapshot = await db
    .collection('receipts')
    .where('created', '>', periodStartDate)
    .get()
  if (receiptsSnapshot.empty) return []
  return (receiptsSnapshot.docs as unknown) as IReceipt[]
}

const getSummaryOfSoldBadgesByCreators = (
  receipts: IReceipt[]
): Record<string, IBadgesSoldRecordValue> => {
  return receipts.reduce((acc, curr) => {
    if (acc[curr.creator]) {
      if (acc[curr.creator][curr.saleCurrency]) {
        acc[curr.creator][curr.saleCurrency] += curr.salePrice
      } else {
        acc[curr.creator][curr.saleCurrency] = curr.salePrice
      }
      acc[curr.creator].count += 1
    } else {
      acc[curr.creator] = { [curr.saleCurrency]: curr.salePrice }
      acc[curr.creator].count = 1
    }
    return acc
  }, {} as any)
}

const getNotificationTokenForUser = async (uid: Uid) => {
  const userDocument = await db.collection('receipts').doc(uid).get()
  if (!userDocument.exists) return null
  return ((userDocument.data() as unknown) as User).notificationToken
}

const getMessagesForCreators = async (dictionary: Record<string, IBadgesSoldRecordValue>) => {
  let messages: NotificationMessageInput[] = []
  for (const [key, value] of Object.entries(dictionary)) {
    const to = await getNotificationTokenForUser(key)
    const title = `Weekly recap:`
    const body = `You sold ${value.count} badges this week for a total of ${
      value.USD ? '$' + value.USD + ' ' : ''
    }  ${value.EUR ? '€' + value.EUR + ' ' : ''} ${value.GBP ? '£' + value.GBP + ' ' : ''}`

    if (to?.length) {
      messages.push({
        to,
        title,
        body,
      })
    }
  }
  return messages
}

export const sendSoldBadgesSummary = async () => {
  try {
    const receipts = await getAllReceiptsFromLastWeek(db)
    const soldBagesSummary = getSummaryOfSoldBadgesByCreators(receipts)
    const messages = await getMessagesForCreators(soldBagesSummary)
    await notificationCenter.sendPushNotificationBatch(messages)
  } catch (error) {
    console.error('Sending sold badges summary failed', error)
  }
}
