import { NotificationType } from '@prisma/client'
import { SendNotificationProps } from '../../types/notificaton'
import { notificationCenter } from './notificationCenter'

interface NewMessageReceivedInput extends Omit<SendNotificationProps, 'title' | 'type'> {
  displayName: string
}

export const sendNewMessageReceivedNotifcation = async ({
  recipientId,
  displayName,
  message,
  pushData: data,
}: NewMessageReceivedInput) => {
  await notificationCenter.sendPushNotificationBatch([
    {
      type: NotificationType.NEW_MESSAGE_RECEIVED,
      recipientId,
      title: 'New Message from ' + (displayName || 'Unknown'),
      message,
      pushData: data,
    },
  ])
}