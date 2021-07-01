import { InputType, Field } from 'type-graphql'
import { Category } from '@generated/type-graphql'
import { BadgeTypeId } from '../../../types/badge'

@InputType()
export class FeedSearchInput {
  @Field({ nullable: true })
  search?: string

  @Field((_) => Category, { nullable: true })
  category?: Category

  @Field({ nullable: true })
  cursor?: BadgeTypeId
}
