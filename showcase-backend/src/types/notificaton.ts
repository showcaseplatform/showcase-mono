import { Uid } from './user'

export interface NotificationMessageInput {
  to: string
  title?: string
  body?: string
  data?: PushNotifcationData
}
export interface PushNotifcation extends NotificationMessageInput {
  sound?: 'default' | null
  badge?: number  // Number to display in the badge on the app icon. Specify zero to clear the badge
}
export interface PushNotifcationData {
  to?: string
  sent?: Date
  read?: boolean
  message?: string
  from?: Uid
  users?: Uid[]
}

export type NotificationType = 'push' | 'normal'

export interface NotificationDocument {
  title: string
  body: string
  user: Uid
  createdAt: Date
  data: PushNotifcationData
  read: boolean
  type: NotificationType
}
