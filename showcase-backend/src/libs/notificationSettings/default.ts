import { NotificationType, UserType } from '@prisma/client'
import { NotificationLimit } from '../../types/notificaton'

export interface NotificationSettingDefault {
  type: NotificationType
  userType: UserType
  allowPushSending?: boolean
  allowEmailSending?: boolean
  allowSmsSending?: boolean
}

// note: there should be 1 setting / userType / notifcationType
export const notificationSettingDefaults: NotificationSettingDefault[] = [
  {
    type: NotificationType.NEW_MESSAGE_RECEIVED,
    allowPushSending: true,
    userType: UserType.basic,
  },
  {
    type: NotificationType.NEW_MESSAGE_RECEIVED,
    allowPushSending: true,
    userType: UserType.creator,
  },
  {
    type: NotificationType.NEW_FRIEND_MESSAGE_RECEIVED,
    allowPushSending: true,
    userType: UserType.basic,
  },
  {
    type: NotificationType.NEW_FRIEND_MESSAGE_RECEIVED,
    allowPushSending: true,
    userType: UserType.creator,
  },
  {
    type: NotificationType.NEW_BADGE_PUBLISHED,
    allowPushSending: true,
    userType: UserType.basic,
  },
  {
    type: NotificationType.NEW_BADGE_PUBLISHED,
    allowPushSending: true,
    userType: UserType.creator,
  },
  {
    type: NotificationType.NEW_FOLLOWER_ADDED,
    allowPushSending: true,
    userType: UserType.basic,
  },
  {
    type: NotificationType.NEW_FOLLOWER_ADDED,
    allowPushSending: true,
    userType: UserType.creator,
  },
  {
    type: NotificationType.SOLD_BADGES_SUMMARY,
    allowPushSending: true,
    userType: UserType.basic,
  },
  {
    type: NotificationType.SOLD_BADGES_SUMMARY,
    allowPushSending: true,
    userType: UserType.creator,
  },
  {
    type: NotificationType.MOST_VIEWED_BADGE,
    allowPushSending: true,
    userType: UserType.basic,
  },
  {
    type: NotificationType.MOST_VIEWED_BADGE,
    allowPushSending: true,
    userType: UserType.creator,
  },
]

// maximum number of times a push  notifcation allowed to be sent within a period (MAX_PUSH_SEND_PERIOD_DAY)
export const MAX_PUSH_SEND_NUMBER: NotificationLimit = {
  [NotificationType.NEW_BADGE_PUBLISHED]: 2,
  [NotificationType.NEW_FOLLOWER_ADDED]: 100,
}

// length of period of which is applied to MAX_PUSH_SEND_NUMBER (-1 = last 24 hours)
export const MAX_PUSH_SEND_PERIOD_DAY: NotificationLimit = {
  [NotificationType.NEW_BADGE_PUBLISHED]: -1,
  [NotificationType.NEW_FOLLOWER_ADDED]: -1,
}
