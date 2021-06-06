import { InputType, Field } from 'type-graphql'
import { Uid } from '../../../types/user'

@InputType()
export class AddNewChatParticipantInput {
  @Field()
  chatId: string
  @Field()
  participantId: Uid
}
