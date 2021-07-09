import { ObjectType, InputType, Field, Int } from 'type-graphql'
import { Category } from '@generated/type-graphql'
import { Min } from 'class-validator'
import { BadgeType } from '@generated/type-graphql'
import { BadgeTypeId } from '../../../types/badge'

export type BadgeTypeCursor = BadgeTypeId

@InputType()
export class ForwardPaginationInput {
  @Field((_) => Int)
  @Min(0)
  first: number

  @Field({ nullable: true })
  after: BadgeTypeCursor
}

@InputType()
export class BackwardPaginationInput {
  @Field((_) => Int)
  @Min(0)
  last: number

  @Field()
  before: BadgeTypeCursor
}

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

@ObjectType()
export class BadgeTypeEdge {
  @Field()
  cursor: BadgeTypeCursor

  @Field((_) => BadgeType)
  node: BadgeType
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean
  @Field()
  hasPreviousPage: boolean
  @Field()
  startCursor: BadgeTypeCursor
  @Field()
  endCursor: BadgeTypeCursor
}

@ObjectType()
export class FeedSearchResponse {
  @Field((_) => [BadgeTypeEdge])
  edges: BadgeTypeEdge[]

  @Field((_) => PageInfo)
  pageInfo: PageInfo
}
