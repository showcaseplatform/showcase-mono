import { InputType, Field, Int } from 'type-graphql'
import { Category } from '@generated/type-graphql'
import { BadgeTypeId } from '../../../types/badge'
import { BackwardPaginationInput, ForwardPaginationInput } from '../../../resolvers/types/cursorConnection'

@InputType()
export class FeedSearchInput {
  @Field({ nullable: true })
  search?: string

  @Field((_) => Category, { nullable: true })
  category?: Category

  @Field({ nullable: true })
  forwardPagination?: ForwardPaginationInput

  @Field({ nullable: true })
  backwardPagination?: BackwardPaginationInput
}
