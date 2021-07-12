import { PushMessage, SendNotificationProps } from '../../types/notificaton'
import { Uid } from '../../types/user'
import {
  expo,
  Expo,
  ExpoPushErrorReceipt,
  ExpoPushMessage,
  ExpoPushTicket,
} from '../../services/expo'
import moment from 'moment'
import { ExpoType } from '@prisma/client'
import { prisma, PrismaClient } from '../../services/prisma'
import Bluebird from 'bluebird'
import { GraphQLError } from 'graphql'
import {
  createManyNotifications,
  findUserNotificationsFromTypeInPeriod,
} from '../database/notification.repo'
import { notificationSettingsLib } from '../notificationSettings/notificationSettingsLib'
import { findUserById } from '../database/user.repo'
import { myPubSub, NEW_NOTIFCATION } from '../../services/pubSub'
import { NotificationSubscriptionPayload } from './types/notificationSubscriptionPayload.type'
import { MAX_PUSH_SEND_NUMBER, MAX_PUSH_SEND_PERIOD_DAY } from '../notificationSettings/default'

class NotificationSenderLib {
  private expo: Expo
  private prisma: PrismaClient

  constructor() {
    this.expo = expo
    this.prisma = prisma
  }

  send = async (notifications: SendNotificationProps[]) => {
    await this.saveNotifications(notifications)
    const pushNotifications = await this.filterPushSettings(notifications)

    if (pushNotifications.length > 0) {
      await this.sendPushNotificationBatch(pushNotifications)
    }
  }

  private sendPushNotificationBatch = async (inputMessages: SendNotificationProps[]) => {
    const pushMessages = await this.constructPushMessages(inputMessages)
    const limitedPushMessages = await this.applyPushMessageLimits(pushMessages)
    const tickets = await this.sendPushMessagesToExpo(limitedPushMessages)
    await this.saveExpoAdminData(tickets, ExpoType.ticket)
  }

  private filterPushSettings = async (notifications: SendNotificationProps[]) => {
    return await Bluebird.filter(notifications, async ({ type, recipientId }) => {
      const user = await findUserById(recipientId)
      if (!user) {
        return false
      }
      const userNotificationSettings = await notificationSettingsLib.getNotificationSettings(user)
      const typeNotificationSettings = userNotificationSettings.find(
        (notificationSettings) => notificationSettings.type === type
      )

      return typeNotificationSettings?.allowPushSending === true
    })
  }

  private applyPushMessageLimits = async (messages: PushMessage[]) => {
    return await Bluebird.filter(messages, async ({ type, uid }) => {
      const sendLimit = MAX_PUSH_SEND_NUMBER[type]
      if (!sendLimit) {
        return true
      }
      // todo: make it conditional, only when MAX_PUSH_SEND_PERIOD_DAY is set for notifcation
      const periodStartDate = moment().add(MAX_PUSH_SEND_PERIOD_DAY[type], 'days').toDate()
      const notifcationsAlreadySentInPeriod = await findUserNotificationsFromTypeInPeriod(
        uid,
        type,
        periodStartDate
      )

      const isUnderLimit = sendLimit >= notifcationsAlreadySentInPeriod.length
      return isUnderLimit
    })
  }

  private getUserNotificationToken = async (uid: Uid) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: uid,
      },
      select: {
        notificationToken: true,
      },
    })
    return user?.notificationToken || null
  }

  private sendPushMessagesToExpo = async (messages: PushMessage[]) => {
    const expoPushMessages: ExpoPushMessage[] = messages.map(({ to, data, body, title }) => {
      return { to, data, body, title, sound: 'default', _displayInForeground: true }
    })
    const chunks = expo.chunkPushNotifications(expoPushMessages)
    const tickets: ExpoPushTicket[] = []

    // Send the chunks to the Expo push notification service.
    await Bluebird.map(chunks, async (chunk) => {
      const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk)
      tickets.push(...ticketChunk)
    })

    return tickets
  }

  private constructPushMessages = async (
    inputMessages: SendNotificationProps[]
  ): Promise<PushMessage[]> => {
    return await Bluebird.map(
      inputMessages,
      async ({ title, type, recipientId, pushData, message }) => {
        const notificationToken = await this.getUserNotificationToken(recipientId)
        const pm: PushMessage = {
          to: notificationToken || '',
          type,
          title,
          uid: recipientId,
          data: pushData || { message: 'test' },
          body: message,
        }
        return pm
      }
    ).filter((m) => Expo.isExpoPushToken(m.to))
  }

  private saveNotifications = async (notifications: SendNotificationProps[]) => {
    const notificationsWithoutPushData = notifications
      .map(({ pushData, ...rest }) => rest)
      .filter((m) => m.recipientId && m.type)

    await createManyNotifications(notificationsWithoutPushData)

    // todo: figure out an efficient way to send the actual created notifcations with subscription payload
    notificationsWithoutPushData.map((notification) => {
      myPubSub.publish(NEW_NOTIFCATION, notification as NotificationSubscriptionPayload)
    })
  }

  // todo: figure out how to deal with error tickets, this should be called by a cronjob from
  searchForErrorsInTickets = async () => {
    // The receipts may contain error codes to which you must respond. In
    // particular, Apple or Google may block apps that continue to send
    // notifications to devices that have blocked notifications or have uninstalled
    // your app. Expo does not control this policy and sends back the feedback from
    // Apple and Google so you can handle it appropriately.
    const receiptIds = await this.getExpoAdminTicketIds()
    if (receiptIds?.length === 0) {
      throw new GraphQLError('There were no tickets found')
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds)
    await Bluebird.map(receiptIdChunks, async (chunk) => {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk)
      const receiptDataToSave = []
      for (const receiptId in receipts) {
        const { status, message, details } = receipts[receiptId] as ExpoPushErrorReceipt
        if (status === 'error') {
          console.error(`There was an error sending a notification: ${message}`)
          if (details && details?.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            console.error(`The error code is ${details.error}`)
          }
          receiptDataToSave.push({ expoId: receiptId, status, message, error: details?.error })
        }
      }
      await this.saveExpoAdminData(receiptDataToSave, ExpoType.receipt)
    })
  }

  private saveExpoAdminData = async (
    tickets: ExpoPushTicket[] | ExpoPushErrorReceipt[],
    type: ExpoType
  ) => {
    const data = tickets.map((t: any) => {
      return {
        type,
        status: t.status,
        expoId: t?.id || null,
        message: t?.message || null,
        error: t?.details?.error || null,
      }
    })
    await this.prisma.expoAdmin.createMany({
      data,
    })
  }

  private getExpoAdminTicketIds = async (): Promise<string[]> => {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    const adminTickets = await this.prisma.expoAdmin.findMany({
      where: {
        type: ExpoType.ticket,
        expoId: {
          not: null,
        },
      },
    })
    return adminTickets.filter((t) => !!t?.expoId).map((t) => t.expoId as string)
  }
}

export const notificationSender = new NotificationSenderLib()
