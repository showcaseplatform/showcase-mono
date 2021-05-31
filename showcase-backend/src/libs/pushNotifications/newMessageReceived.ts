import { NotificationName, PushNotifcationData } from '../../types/notificaton'
import { Uid } from '../../types/user'
import { notificationCenter } from './notificationCenter'

interface NewMessageReceivedInput {
  uid: Uid
  displayName: string
  body: string
  data: PushNotifcationData
}

export const sendNewMessageReceivedNotifcation = async ({
  uid,
  displayName,
  body,
  data,
}: NewMessageReceivedInput) => {
  await notificationCenter.sendPushNotificationBatch([
    {
      name: NotificationName.NEW_MESSAGE_RECEIVED,
      uid,
      title: 'New Message from ' + (displayName || 'Unknown'),
      body,
      data,
    },
  ])
}