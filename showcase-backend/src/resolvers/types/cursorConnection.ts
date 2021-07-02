import { ObjectType, Field, InputType, Int } from 'type-graphql'
import { Min } from 'class-validator'
import { BadgeType } from '@generated/type-graphql'

export type Cursor = string

@ObjectType()
export class ConnectionEdge {
  @Field()
  cursor: Cursor

  @Field()
  node: BadgeType
}

@ObjectType()
export class ConnectionPageInfo {
  @Field()
  hasNextPage: boolean
  @Field()
  hasPreviousPage: boolean
  @Field()
  startCursor: Cursor
  @Field()
  endCursor: Cursor
}

@ObjectType()
export class CursorConnectionResponse {
  @Field((_) => [ConnectionEdge])
  edges: ConnectionEdge[]

  @Field((_) => ConnectionPageInfo)
  pageInfo: ConnectionPageInfo
}

@InputType()
export class ForwardPaginationInput {
  @Field((_) => Int)
  @Min(0)
  first: number

  @Field({nullable: true})
  after: Cursor
}

@InputType()
export class BackwardPaginationInput {
  @Field((_) => Int)
  @Min(0)
  last: number

  @Field()
  before: Cursor
}
