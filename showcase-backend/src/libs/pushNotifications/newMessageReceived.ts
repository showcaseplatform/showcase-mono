import { NotificationType } from '@prisma/client'
import Bluebird from 'bluebird'
import { SendNotificationProps } from '../../types/notificaton'
import { findFollow } from '../database/follow.repo'
import { notificationSender } from '../notification/notificationSenderLib'

interface NewMessageReceivedInput extends Omit<SendNotificationProps, 'title' | 'type'> {
  senderId: string
  senderDisplayName: string
}

const isSenderFriendOfRecipient = async (senderId: string, recipientId: string) => {
  const follow = await findFollow(senderId, recipientId)
  return !!follow
}

export const sendNewMessageReceivedNotifcations = async (input: NewMessageReceivedInput[]) => {
  try {
    const messages = await Bluebird.map(input, async (i) => {
      const { recipientId, senderId, senderDisplayName, message, pushData: data } = i
      return {
        type: await isSenderFriendOfRecipient(senderId, recipientId)
          ? NotificationType.NEW_FRIEND_MESSAGE_RECEIVED
          : NotificationType.NEW_MESSAGE_RECEIVED,
        recipientId,
        title: 'New Message from ' + senderDisplayName,
        message,
        pushData: data,
      }
    })

    await notificationSender.send(messages)
  } catch (error) {
    // make it fail silently
    console.error('sendNewMessageReceivedNotifcation failed: ', { error })
  }
}
