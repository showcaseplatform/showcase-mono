import { ObjectType, Field } from 'type-graphql'
import { BadgeType, Cause, Profile } from '@generated/type-graphql'

@ObjectType({ description: 'Input data to create crypto account' })
export class FullTextSearchResult {
  @Field((_) => [BadgeType])
  badgeTypes: BadgeType[]

  @Field((_) => [Cause])
  causes: Cause[]

  @Field((_) => [Profile])
  profiles: Profile[]
}
