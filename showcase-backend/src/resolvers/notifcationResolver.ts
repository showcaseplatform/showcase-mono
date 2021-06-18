import { Arg, Authorized, Ctx, Mutation, Resolver, Root, Subscription } from 'type-graphql'
import { notificationMarker } from '../libs/notification/notificationMarker'
import { Notification, User } from '@generated/type-graphql'
import {
  addNotifcationToken,
  removeNotifcationToken,
} from '../libs/notification/updateNotifcationToken'
import { NotificationToken } from '../types/user'
import { MarkAsReadInfoUnion } from '../libs/notification/types/notificationMarker.type'
import { UserType } from '@prisma/client'
import { NEW_NOTIFCATION } from '../services/pubSub'
import { NotificationSubscriptionPayload } from '../libs/notification/types/notificationSubscriptionPayload.type'
import { CurrentUser } from '../libs/auth/decorators'

@Resolver()
export class NotificationResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => MarkAsReadInfoUnion)
  async markAsRead(@Arg('notificationId') notificationId: string) {
    return await notificationMarker.markOneAsRead(notificationId)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => [Notification])
  async markAllAsRead(@CurrentUser() currentUser: User) {
    return await notificationMarker.markAllAsRead(currentUser.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => User)
  async removeNotifcationToken(@CurrentUser() currentUser: User) {
    return await removeNotifcationToken(currentUser.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => User)
  async addNotifcationToken(
    @Arg('notificationToken') notificationToken: NotificationToken,
    @CurrentUser() currentUser: User
  ) {
    return await addNotifcationToken(notificationToken, currentUser.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Subscription({
    topics: NEW_NOTIFCATION,
    filter: async ({
      context,
      payload,
    }: {
      context: { user: User }
      payload: NotificationSubscriptionPayload
    }) => {
      return payload.recipientId === context.user.id
    },
  })
  newNotification(
    @Root() payload: NotificationSubscriptionPayload
  ): NotificationSubscriptionPayload {
    return { ...payload }
  }
}
