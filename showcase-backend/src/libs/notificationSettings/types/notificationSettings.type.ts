import { InputType, Field } from 'type-graphql'
import { NotificationType } from '@generated/type-graphql'

@InputType()
export class NotificationSettingsInput {
  @Field(() => NotificationType)
  type: NotificationType

  @Field({nullable: true})
  allowEmailSending?: boolean

  @Field({nullable: true})
  allowSmsSending?: boolean

  @Field({nullable: true})
  allowPushSending?: boolean
}
