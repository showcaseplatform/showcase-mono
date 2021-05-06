import { firestore } from 'firebase-admin'
import { Uid } from './user'

// add new notification type here
export enum NotificationName {
  NEW_BADGE_PUBLISHED = 'NEW_BADGE_PUBLISHED',
  NEW_FOLLOWER_ADDED = 'NEW_FOLLOWER_ADDED',
  NEW_MESSAGE_RECEIVED = 'NEW_MESSAGE_RECEIVED',
  SOLD_BADGES_SUMMARY = 'SOLD_BADGES_SUMMARY',
  MOST_VIEWED_BADGE = 'MOST_VIEWED_BADGE',
}

export type NotificationType = 'push' | 'normal'
export type NotifcationToken = string
export interface PushNotifcationData {
  to?: NotifcationToken
  sent?: Date
  read?: boolean
  message?: string
  from?: Uid
  users?: Uid[]
  badgeId?: string
}
export interface NotifcationBase {
  title?: string
  body?: string
  data?: PushNotifcationData
}

export interface NotificationMessageInput extends NotifcationBase {
  name: NotificationName
  uid: Uid
}

export interface PushMessage extends NotificationMessageInput {
  to: NotifcationToken
}
export interface NotificationDocumentData extends NotificationMessageInput {
  read?: boolean
  type?: NotificationType
}
export interface NotificationDocument extends NotificationDocumentData {
  id: string
  createTime: firestore.Timestamp
}

export interface NotificationTrackerInput {
  name: NotificationName
  uid: Uid
}

type TrackerRecord<K extends keyof any, T> = {
  [P in K]?: T
}

export type NotificationTrackerDoc = TrackerRecord<NotificationName, number>
