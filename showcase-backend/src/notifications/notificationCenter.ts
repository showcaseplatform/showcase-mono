import { FieldValue, firestore as db, FieldPath, Timestamp } from '../services/firestore'
import {
  NotificationDocument,
  NotificationName,
  NotificationInput,
  PushMessage,
  NotificationLimitDoc,
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

  // todo: sendNotifcation ()

  sendPushNotificationBatch = async (inputMessages: NotificationInput[]) => {
    try {
      const pushMessages = await this.validateInputMessages(inputMessages)
      await this.savePushMessages(pushMessages)
      const filteredPushMessages = await this.filterPushMessages(pushMessages)
      const tickets = await this.sendPushMessagesToExpo(filteredPushMessages)
      await this.saveNotifcationTickets(tickets)
    } catch (error) {
      console.error('sendPushNotificationBatch failed', error)
      throw error
    }
  }

  changeUnreadCount = async ({ uid, change }: { uid: Uid; change: number }) => {
    try {
      await db
        .collection('users')
        .doc(uid)
        .collection('notifications')
        .doc('unRead')
        .set({ count: FieldValue.increment(change) })
    } catch (error) {
      console.error('incrementUnreadCount failed', error)
      throw error
    }
  }

  private filterPushMessages = async (messages: PushMessage[]) => {
    return messages.filter(async ({ uid, name }) => {
      const sendLimit = MAX_PUSH_SEND_NUMBER[name]
      if (!sendLimit) {
        return true
      }
      // todo: make it conditional, only when MAX_PUSH_SEND_PERIOD_DAY is set for notifcation
      const periodStartTimestamp = Timestamp.fromDate(moment().add(MAX_PUSH_SEND_PERIOD_DAY, 'days').toDate()) 
      // todo: create composite index for this
      const notificationSnapshot = await db
        .collection('users')
        .doc(uid)
        .collection('notifcations')
        .where('createdAt', '>', periodStartTimestamp)
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
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
          tickets.push(...ticketChunk)
        } catch (error) {
          console.error('sendPushMessagesToExpo failed: ', error)
          throw error
        }
      })
    )

    return tickets
  }

  private validateInputMessages = async (inputMessages: NotificationInput[]) => {
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

  private savePushMessages = async (messages: PushMessage[]) => {
    try {
      messages.forEach(async (message) => {
        await this.saveNotificationData({ ...message, type: 'push' })
      })
    } catch (error) {
      console.error('savePushMessages failed: ', error)
      throw error
    }
  }

  private saveNotificationData = async ({
    name,
    uid,
    title,
    body,
    data,
    type = 'normal',
    read = false,
    createdAt = FieldValue.serverTimestamp(),
  }: NotificationDocument) => {
    try {
      const notificationDoc: NotificationDocument = {
        name,
        title,
        body,
        uid,
        data,
        read,
        type,
        createdAt,
      }
      await db.collection('users').doc(uid).collection('notifications').add(notificationDoc)
      if (!read) {
        await this.changeUnreadCount({ uid, change: 1 })
      }
      console.log('Notification  saved to db', notificationDoc)
    } catch (error) {
      console.error('Notification could not be saved to db', error)
      throw error
    }
  }

  // todo: how to deal with error tickets?
  searchForErrorsInTickets = async () => {
    try {
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
    } catch (error) {
      console.error('Error happend while parsing expo tickets', error)
      throw error
    }
  }

  private saveNotifcationTickets = async (tickets: ExpoPushTicket[]) => {
    for (let ticket of tickets) {
      try {
        await db.collection('expoTickets').add(ticket)
      } catch (error) {
        console.error('Expo push ticket coudnt be saved', error)
        throw error
      }
    }
  }

  private saveErrorReceipt = async (receipt: ExpoPushErrorReceipt) => {
    try {
      await db.collection('expoErrorReceipts').add(receipt)
    } catch (error) {
      console.error('Expo push error receipt coudnt be saved', error)
      throw error
    }
  }

  private getNotifcationTickets = async (): Promise<ExpoPushTicket[]> => {
    try {
      const snapshot = await db.collection('expoTickets').get()
      if (snapshot.empty) {
        return []
      } else {
        return snapshot.docs.map((doc) => doc.data() as ExpoPushTicket)
      }
    } catch (error) {
      console.error('Expo push ticket coudnt be downloaded', error)
      throw error
    }
  }
}

export const notificationCenter = new NotificationCenter()
