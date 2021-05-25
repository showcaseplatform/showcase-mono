import { InputType, Field } from 'type-graphql'
import { BadgeId, BadgeTypeId } from '../../types/badge'

@InputType({ description: 'Data for counting views' })
export class CountViewInput {
  @Field()
  marketplace: boolean

  @Field()
  badgeId: BadgeId | BadgeTypeId
}

