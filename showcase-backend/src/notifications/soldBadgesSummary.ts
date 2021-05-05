import { firestore as db } from '../services/firestore'
import moment from 'moment'
import { IReceipt } from '../types/receipt'
import { Uid } from '../types/user'
import { notificationCenter } from './notificationCenter'
import { NotificationInput, NotificationName } from '../types/notificaton'

// todo: currently this notification is not used
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
): Record<Uid, IBadgesSoldRecordValue> => {
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

const getMessagesForCreators = async (dictionary: Record<Uid, IBadgesSoldRecordValue>) => {
  let inputMessages: NotificationInput[] = []
  for (const [uid, value] of Object.entries(dictionary)) {
    const title = `Weekly recap:`
    const body = `You sold ${value.count} badges this week for a total of ${
      value.USD ? '$' + value.USD + ' ' : ''
    }  ${value.EUR ? '€' + value.EUR + ' ' : ''} ${value.GBP ? '£' + value.GBP + ' ' : ''}`

    inputMessages.push({
      name: NotificationName.SOLD_BADGES_SUMMARY,
      uid,
      title,
      body,
    })
  }
  return inputMessages
}

export const sendSoldBadgesSummary = async () => {
  try {
    const receipts = await getAllReceiptsFromLastWeek(db)
    const soldBagesSummary = getSummaryOfSoldBadgesByCreators(receipts)
    const inputMessages = await getMessagesForCreators(soldBagesSummary)
    await notificationCenter.sendPushNotificationBatch(inputMessages)
  } catch (error) {
    console.error('Sending sold badges summary failed', error)
  }
}
