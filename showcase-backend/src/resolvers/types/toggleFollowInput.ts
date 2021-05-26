import { InputType, Field } from 'type-graphql'
import { Uid } from '../../types/user'

@InputType({ description: 'Data for toggle follow relationships' })
export class ToggleFollowInput {
  @Field()
  friendId: Uid
}
