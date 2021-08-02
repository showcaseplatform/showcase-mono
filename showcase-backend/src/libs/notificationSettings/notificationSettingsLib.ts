import { NotificationSettings, NotificationType, User, UserType } from '@prisma/client'
import { checkValue } from '../../utils/checkValue'
import {
  findUniqueNotificationSettings,
  findUserNotificationSettings,
  upsertNotifcationSettings,
} from '../../database/notificationSettings.repo'
import { notificationSettingDefaults } from './default'
import { NotificationSettingsInput } from './types/notificationSettings.type'

class NotificationSettingsLib {
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

    settings.allowPushSending = checkValue(newSettings.allowPushSending, settings.allowPushSending)

    return await upsertNotifcationSettings(settings)
  }
}

const notificationSettingsLib = new NotificationSettingsLib()

export { notificationSettingsLib }
