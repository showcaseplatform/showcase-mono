import { FieldValue, firestore as db, Timestamp } from '../services/firestore'
import {
  NotificationDocumentData,
  NotificationMessageInput,
  NotificationName,
  PushMessage,
  NotificationLimitDoc,
  NotificationType,
} from '../types/notificaton'
import { Uid, User } from '../types/user'
import {
  expo,
  Expo,
  ExpoPushErrorReceipt,
  ExpoPushMessage,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
} from '../services/expo'
import moment from 'moment'
import Boom from 'boom'

// todo: store these is db so it can be modifed easier
// To limit number of push notication sent to a specific user, modify this
const MAX_PUSH_SEND_NUMBER: NotificationLimitDoc = {
  [NotificationName.NEW_BADGE_PUBLISHED]: 2,
  [NotificationName.NEW_FOLLOWER_ADDED]: 100,
}
const MAX_PUSH_SEND_PERIOD_DAY = -1

class NotificationCenter {
  expo: Expo

  constructor() {
    this.expo = expo
  }

  // todo: create a func like: sendNotifcation = () => {}, which handles all notification send, also decides whether to call sendPushNoti...

  sendPushNotificationBatch = async (inputMessages: NotificationMessageInput[]) => {
    await this.saveMessages(inputMessages, 'push')
    const pushMessages = await this.validateInputMessages(inputMessages)
    const filteredPushMessages = await this.filterPushMessages(pushMessages)
    const tickets = await this.sendPushMessagesToExpo(filteredPushMessages)
    await this.saveNotifcationTickets(tickets)
  }

  changeUnreadCount = async ({ uid, change }: { uid: Uid; change: number }) => {
    await db
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .doc('unRead')
      .set({ count: FieldValue.increment(change) })
  }

  private filterPushMessages = async (messages: PushMessage[]) => {
    return messages.filter(async ({ uid, name }) => {
      const sendLimit = MAX_PUSH_SEND_NUMBER[name]
      if (!sendLimit) {
        return true
      }
      // todo: make it conditional, only when MAX_PUSH_SEND_PERIOD_DAY is set for notifcation
      const periodStartTimestamp = Timestamp.fromDate(
        moment().add(MAX_PUSH_SEND_PERIOD_DAY, 'days').toDate()
      )
      // todo: create composite index for this
      const notificationSnapshot = await db
        .collection('users')
        .doc(uid)
        .collection('notifcations')
        .where('createdDate', '>', periodStartTimestamp)
        .where('name', '==', name)
        .limit(sendLimit)
        .get()
      if (notificationSnapshot.size >= sendLimit) {
        return false
      } else {
        return true
      }
    })
  }

  private getUserToken = async (uid: Uid) => {
    const userDoc = await db.collection('users').doc(uid).get()
    const { notificationToken = null } = userDoc.data() as User
    return { notificationToken }
  }

  private sendPushMessagesToExpo = async (messages: PushMessage[]) => {
    const expoPushMessages: ExpoPushMessage[] = messages.map(({ to, data, body, title }) => {
      return { to, data, body, title, sound: 'default', _displayInForeground: true }
    })
    const chunks = expo.chunkPushNotifications(expoPushMessages)
    const tickets: ExpoPushTicket[] = []

    // todo: bluebird.map lib instead nested await
    // Send the chunks to the Expo push notification service.
    await Promise.all(
      chunks.map(async (chunk) => {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
        tickets.push(...ticketChunk)
      })
    )

    return tickets
  }

  private validateInputMessages = async (inputMessages: NotificationMessageInput[]) => {
    let pushMessages: PushMessage[] = []

    for (let message of inputMessages) {
      const { name, uid, title, body, data } = message
      const { notificationToken } = await this.getUserToken(uid)
      if (Expo.isExpoPushToken(notificationToken)) {
        pushMessages.push({ to: notificationToken, title, body, data, name, uid })
      } else {
        console.error(`Push token ${notificationToken} is not a valid Expo push token`)
      }
    }

    return pushMessages
  }

  private saveMessages = async (messages: NotificationMessageInput[], type: NotificationType) => {
    messages.forEach(async (message) => {
      await this.saveNotificationData({ ...message, type })
    })
  }

  private saveNotificationData = async ({
    name,
    uid,
    title = '',
    body = '',
    data = {},
    type = 'normal',
    read = false,
    createdDate = new Date(),
  }: NotificationDocumentData) => {
    if (name && uid) {
      const notificationDoc: NotificationDocumentData = {
        name,
        title,
        body,
        uid,
        data,
        read,
        type,
        createdDate,
      }
      await db.collection('users').doc(uid).collection('notifications').add(notificationDoc)
      if (!read) {
        await this.changeUnreadCount({ uid, change: 1 })
      }
    } else {
      throw Boom.badData('Notifcation name and uid most be provided')
    }
  }

  // todo: how to deal with error tickets?
  searchForErrorsInTickets = async () => {
    const tickets = await this.getNotifcationTickets()
    if (tickets?.length === 0) throw 'There were no tickets found'

    // The receipts may contain error codes to which you must respond. In
    // particular, Apple or Google may block apps that continue to send
    // notifications to devices that have blocked notifications or have uninstalled
    // your app. Expo does not control this policy and sends back the feedback from
    // Apple and Google so you can handle it appropriately.
    let receiptIds = []
    for (let ticket of tickets) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      if ((ticket as ExpoPushSuccessTicket).id) {
        receiptIds.push((ticket as ExpoPushSuccessTicket).id)
      }
    }
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds)
    await Promise.all(
      receiptIdChunks.map(async (chunk) => {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk)
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId] as ExpoPushErrorReceipt
          if (status === 'error') {
            console.error(`There was an error sending a notification: ${message}`)
            if (details && details.hasOwnProperty('error')) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // You must handle the errors appropriately.
              console.error(`The error code is ${details.error}`)
              await this.saveErrorReceipt({ status, message, details })
            }
          }
        }
      })
    )
  }

  private saveNotifcationTickets = async (tickets: ExpoPushTicket[]) => {
    for (const ticket of tickets) {
      await db.collection('expoTickets').add(ticket)
    }
  }

  private saveErrorReceipt = async (receipt: ExpoPushErrorReceipt) => {
    await db.collection('expoErrorReceipts').add(receipt)
  }

  private getNotifcationTickets = async (): Promise<ExpoPushTicket[]> => {
    const snapshot = await db.collection('expoTickets').get()
    if (snapshot.empty) throw 'expoTickets collection is empty'
    return snapshot.docs.map((doc) => doc.data() as ExpoPushTicket)
  }
}

export const notificationCenter = new NotificationCenter()
