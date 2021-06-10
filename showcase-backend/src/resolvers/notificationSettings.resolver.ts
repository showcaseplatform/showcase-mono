import { UserType, User } from '@prisma/client'
import { Authorized, Query, Ctx, Mutation, Arg, Resolver } from 'type-graphql'
import { NotificationSettingsInput } from '../libs/notificationSettings/types/notificationSettings.type'
import { NotificationSettings } from '@generated/type-graphql'
import { notificationSettingsLib } from '../libs/notificationSettings/notificationSettingsLib'

@Resolver(NotificationSettings)
export class NotificationSettingsResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Query(() => [NotificationSettings])
  async notificationSettings(@Ctx('user') user: User) {
    return await notificationSettingsLib.getNotificationSettings(user)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => NotificationSettings)
  async updateNotificationSettings(
    @Ctx('user') user: User,
    @Arg('newSettings') newSettings: NotificationSettingsInput
  ) {
    return await notificationSettingsLib.updateNotificationSettings(user, newSettings)
  }
}
