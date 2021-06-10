import { NotificationSettings, NotificationType, User, UserType } from '@prisma/client'
import { checkValue } from '../../utils/checkValue'
import {
  findUniqueNotificationSettings,
  findUserNotificationSettings,
  upsertNotifcationSettings,
} from '../database/notificationSettings.repo'
import { NotificationSettingsInput } from './types/notificationSettings.type'

type NotificationSettingDefault = {
  type: NotificationType
  userType: UserType
  allowPushSending?: boolean
  allowEmailSending?: boolean
  allowSmsSending?: boolean
}

// todo: add more default settings
export const notificationSettingDefaults: NotificationSettingDefault[] = [
  {
    type: NotificationType.NEW_MESSAGE_RECEIVED,
    allowEmailSending: false,
    allowSmsSending: false,
    allowPushSending: true,
    userType: UserType.basic,
  },
  {
    type: NotificationType.NEW_MESSAGE_RECEIVED,
    allowEmailSending: false,
    allowSmsSending: false,
    allowPushSending: true,
    userType: UserType.creator,
  },
]

class NotificationSettingsLib {
  // todo: todo apply these settings on notifcations
  async getNotificationSettings(user: User) {
    const userSavedSettings = await findUserNotificationSettings(user.id)
    const defaultNotificationTypesForUser = notificationSettingDefaults
      .filter(({ type, userType }) => {
        const hasSaved = userSavedSettings.find((n) => n.type === type)
        const isSameUserType = userType === user.userType
        return isSameUserType && !hasSaved
      })
      .map((notificationDefault) => {
        const currentSetting = {} as NotificationSettings
        currentSetting.id = user.id
        currentSetting.type = notificationDefault.type
        currentSetting.allowEmailSending = !!notificationDefault.allowEmailSending
        currentSetting.allowSmsSending = !!notificationDefault.allowSmsSending
        currentSetting.allowPushSending = !!notificationDefault.allowPushSending
        return currentSetting
      })
    return [...defaultNotificationTypesForUser, ...userSavedSettings]
  }

  async updateNotificationSettings(user: User, newSettings: NotificationSettingsInput) {
    const defaults = notificationSettingDefaults.find(
      ({ type, userType }) => type === newSettings.type && userType === user.userType
    )

    if (!defaults) {
      throw new Error('Invalid notification type for this user!')
    }

    let settings = await findUniqueNotificationSettings(user.id, newSettings.type)

    if (!settings) {
      settings = {} as NotificationSettings
      settings.id = user.id
      settings.type = newSettings.type
    }

    settings.allowEmailSending = checkValue(
      newSettings.allowEmailSending,
      settings.allowEmailSending
    )

    settings.allowSmsSending = checkValue(newSettings.allowSmsSending, settings.allowSmsSending)

    settings.allowPushSending = checkValue(newSettings.allowPushSending, settings.allowPushSending)

    return await upsertNotifcationSettings(settings)
  }
}

const notificationSettingsLib = new NotificationSettingsLib()

export { notificationSettingsLib }
