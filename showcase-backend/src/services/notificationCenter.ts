import axios from 'axios'
import { expo as expoConfig } from '../config'
import { firestore as db } from './firestore'
import {
  INotificationDocument,
  INotificationMessageInput,
  IPushNotifcationData,
  NotificationType,
} from '../types/notificaton'
import { Uid } from '../types/user'
import {
  expo,
  Expo,
  ExpoPushErrorReceipt,
  ExpoPushMessage,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
} from './expo'

export class NotificationCenter {
  constructor() {}

  saveNotificationToDb = async (
    title: string,
    body: string,
    user: Uid,
    data: IPushNotifcationData,
    type: NotificationType
  ) => {
    try {
      const notificationDoc: INotificationDocument = {
        title,
        body,
        user,
        createdAt: new Date(),
        data,
        read: false,
        type: type || 'normal',
      }
      await db.collection('notifications').add(notificationDoc)
      console.log('Notification  saved to db', notificationDoc)
    } catch (error) {
      console.error('Notification could not be saved to db', error)
    }
  }

  sendPushNotification = async (
    to: string,
    title: string,
    body: string,
    data?: IPushNotifcationData
  ) => {
    const message = {
      to,
      sound: 'default',
      title,
      body,
      data,
      _displayInForeground: true, // todo: is this working?
    }

    try {
      const response = await axios({
        url: expoConfig.server,
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        data: message,
      })
      console.log('SENT NOTIFICATION', response)
      return true
    } catch (error) {
      console.log('ERR SENDING NOTIFICATION', error)
      return true
    }
  }

  sendPushNotificationBatch = async (inputMessages: INotificationMessageInput[]) => {
    let messages: ExpoPushMessage[] = []
    for (let message of inputMessages) {
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(message.to)) {
        console.error(`Push token ${message.to} is not a valid Expo push token`)
        continue
      }
      messages.push({...message, sound: 'default'})
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages)
    let tickets: ExpoPushTicket[] = []

    // Send the chunks to the Expo push notification service.
    await Promise.all(
      chunks.map(async (chunk) => {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk)
          tickets.push(...ticketChunk)
        } catch (error) {
          console.error(error)
        }
      })
    )
    await this.saveNotifcationTickets(tickets)
  }

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
              }
            }
          }
        })
      )
    } catch (error) {
      console.error('Error happend while parsing expo tickets', error)
    }
  }

  private saveNotifcationTickets = async (tickets: ExpoPushTicket[]) => {
    for (let ticket of tickets) {
      try {
        await db.collection('expotickets').add(ticket)
      } catch (error) {
        console.error('Expo push ticket coudnt be saved', error)
      }
    }
  }

  private getNotifcationTickets = async (): Promise<ExpoPushTicket[]> => {
    try {
      const snapshot = await db.collection('expotickets').get()
      return snapshot.docs.map((doc) => doc.data() as ExpoPushTicket)
    } catch (error) {
      console.error('Expo push ticket coudnt be downloaded', error)
      return []
    }
  }

  // private getNotificationData = (to: Uid, message: string): IPushNotifcationData => {
  //   return {
  //     sent: new Date(),
  //     read: false,
  //     message: message,
  //     to,
  //   }
  // }
}
