import { UserType, User } from '@prisma/client'
import { Authorized, Query, Mutation, Arg, Resolver } from 'type-graphql'
import { NotificationSettingsInput } from '../libs/notificationSettings/types/notificationSettings.type'
import { NotificationSettings } from '@generated/type-graphql'
import { notificationSettingsLib } from '../libs/notificationSettings/notificationSettingsLib'
import { CurrentUser } from '../libs/auth/decorators'

@Resolver(NotificationSettings)
export class NotificationSettingsResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Query(() => [NotificationSettings])
  async notificationSettings(@CurrentUser() currentUser: User): Promise<NotificationSettings[]> {
    return await notificationSettingsLib.getNotificationSettings(currentUser)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => NotificationSettings)
  async updateNotificationSettings(
    @Arg('newSettings') newSettings: NotificationSettingsInput,
    @CurrentUser() currentUser: User
  ): Promise<NotificationSettings> {
    return await notificationSettingsLib.updateNotificationSettings(currentUser, newSettings)
  }
}
