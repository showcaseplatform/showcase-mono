import { NotificationType } from '@prisma/client'
import { SendNotificationProps } from '../../types/notificaton'
import { notificationCenter } from './notificationCenter'

interface NewMessageReceivedInput extends Omit<SendNotificationProps, 'title' | 'type'> {
  displayName: string
}

export const sendNewMessageReceivedNotifcations = async (input: NewMessageReceivedInput[]) => {
  try {
    const messages = input.map((i) => {
      const { recipientId, displayName, message, pushData: data } = i
      return {
        type: NotificationType.NEW_MESSAGE_RECEIVED,
        recipientId,
        title: 'New Message from ' + displayName,
        message,
        pushData: data,
      }
    })

    await notificationCenter.sendPushNotificationBatch(messages)
  } catch (error) {
    // make it fail silently
    console.error('sendNewMessageReceivedNotifcation failed: ', { error })
  }
}
