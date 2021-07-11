import { ObjectType, Field } from 'type-graphql'
import { BadgeType, Cause, Profile } from '@generated/type-graphql'

@ObjectType({ description: 'Input data to create crypto account' })
export class FullTextSearchResponse {
  @Field(() => [BadgeType])
  badgeTypes: BadgeType[]

  @Field(() => [Cause])
  causes: Cause[]

  @Field(() => [Profile])
  profiles: Profile[]
}
