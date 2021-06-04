import { NotificationType } from '@prisma/client'
import { Uid } from './user'

export type NotifcationToken = string

// we don't want to save this to db, but needed to send push notifcations
export interface PushData {
  to?: NotifcationToken
  sent?: Date
  read?: boolean
  message?: string
  from?: Uid
  users?: Uid[]
  badgeId?: string
}

export type SendNotificationProps = {
  type: NotificationType
  title: string
  message: string
  recipientId: Uid
  pushData?: PushData
}

export interface PushMessage {
  to: NotifcationToken
  title: string
  body: string
  uid: Uid
  type: NotificationType
  data: PushData
}

type LimitRecord<K extends keyof any, T> = {
  [P in K]?: T
}

export type NotificationLimitDoc = LimitRecord<NotificationType, number>
