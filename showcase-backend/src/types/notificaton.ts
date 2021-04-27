import { Uid } from './user'

export interface IPushNotifcationData {
  to: string
  sent: Date
  read: boolean
  message: string
  from?: Uid
  users?: Uid[]
}

export type NotificationType = 'push' | 'normal'

export interface INotificationDocument {
  title: string
  body: string
  user: Uid
  createdAt: Date
  data: IPushNotifcationData
  read: boolean
  type: NotificationType
}
