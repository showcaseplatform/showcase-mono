import { InputType, Field } from 'type-graphql'

@InputType()
export class SendMessageBase {
  // todo: validate chat message
  @Field()
  message: string
}

@InputType()
export class NewChatMessageInput extends SendMessageBase {
  @Field()
  recipientId: string
}

@InputType()
export class ExistingChatMessageInput extends SendMessageBase {
  @Field()
  chatId: string
}
