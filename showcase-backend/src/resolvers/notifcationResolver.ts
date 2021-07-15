import { Arg, Authorized, Mutation, Resolver, Root, Subscription } from 'type-graphql'
import { notificationMarker } from '../libs/notification/notificationMarker'
import { Notification, User } from '@generated/type-graphql'
import {
  addNotifcationToken,
  removeNotifcationToken,
} from '../libs/notification/updateNotifcationToken'
import { NotificationToken } from '../types/user'
import { MarkAsReadInfoUnion, MarkerInfo } from '../libs/notification/types/notificationMarker.type'
import { UserType } from '@prisma/client'
import { NEW_NOTIFCATION } from '../services/pubSub'
import { NotificationSubscriptionPayload } from '../libs/notification/types/notificationSubscriptionPayload.type'
import { CurrentUser } from '../libs/auth/decorators'
import { allUserTypes } from '../libs/auth/authLib'

@Resolver()
export class NotificationResolver {
  @Authorized(...allUserTypes)
  @Mutation(() => MarkAsReadInfoUnion)
  async markAsRead(
    @Arg('notificationId') notificationId: string
  ): Promise<MarkerInfo | Notification> {
    return await notificationMarker.markOneAsRead(notificationId)
  }

  @Authorized(...allUserTypes)
  @Mutation(() => [Notification])
  async markAllAsRead(@CurrentUser() currentUser: User): Promise<Notification[]> {
    return await notificationMarker.markAllAsRead(currentUser.id)
  }

  @Authorized(...allUserTypes)
  @Mutation(() => User)
  async removeNotifcationToken(@CurrentUser() currentUser: User): Promise<User> {
    return await removeNotifcationToken(currentUser.id)
  }

  @Authorized(...allUserTypes)
  @Mutation(() => User)
  async addNotifcationToken(
    @Arg('notificationToken') notificationToken: NotificationToken,
    @CurrentUser() currentUser: User
  ): Promise<User> {
    return await addNotifcationToken(notificationToken, currentUser.id)
  }

  @Authorized(...allUserTypes)
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
