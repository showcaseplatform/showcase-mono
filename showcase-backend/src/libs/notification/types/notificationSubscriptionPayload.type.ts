import { NotificationType } from '@generated/type-graphql'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class NotificationSubscriptionPayload {
  @Field(() => NotificationType)
  type: NotificationType

  @Field()
  title: string

  @Field()
  message: string

  @Field()
  recipientId: string
}
