import { firestore } from 'firebase-admin';
import { Uid } from './user'

// todo: rename this to notifcation type
// add new notification type here
export enum NotificationName {
  NEW_BADGE_PUBLISHED = 'NEW_BADGE_PUBLISHED',
  NEW_FOLLOWER_ADDED = 'NEW_FOLLOWER_ADDED',
  NEW_MESSAGE_RECEIVED = 'NEW_MESSAGE_RECEIVED',
  SOLD_BADGES_SUMMARY = 'SOLD_BADGES_SUMMARY',
  MOST_VIEWED_BADGE = 'MOST_VIEWED_BADGE',
}

// todo: this should be calculated on the notfication type (see above)
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
  data?: PushNotifcationData | undefined 
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
  createdDate?: Date
}
export interface NotificationDocument extends NotificationDocumentData {
  id: string
}

export interface UnreadDocumentData {
  count: number
}
export interface UnreadDocument extends UnreadDocumentData {
  updateTime: firestore.FieldValue
}

type LimitRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type NotificationLimitDoc = LimitRecord<NotificationName, number>
