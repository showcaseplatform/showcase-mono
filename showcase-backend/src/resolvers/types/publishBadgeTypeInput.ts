import { InputType, Field, Int } from 'type-graphql'
import { BadgeTypeCreateInput, Category } from '@generated/type-graphql'
import { Min, Max, MaxLength } from 'class-validator'

import { registerEnumType } from 'type-graphql'

registerEnumType(Category, {
  name: 'Category',
  description: 'Categories which could be selected when creating BadgeType',
})

@InputType({ description: 'Data for publishing a new badgeType' })
export class PublishBadgeTypeInput implements Partial<BadgeTypeCreateInput> {
  @Field()
  id: string

  @Field()
  @MaxLength(20)
  title: string

  // todo: what type should price have
  @Field((_type) => Int)
  @Min(0.01)
  @Max(200)
  price: number

  @Field((_type) => Int)
  @Min(1)
  @Max(1000000)
  supply: number

  @Field({ nullable: true })
  @MaxLength(240)
  description?: string

  @Field()
  image: string

  @Field()
  imageHash: string

  @Field((_type) => Category)
  category: Category

  @Field((_type) => Int)
  causeId?: number

  @Field((_type) => Int)
  @Min(0.05)
  @Max(0.5)
  donationAmount?: number

  @Field()
  gif: boolean
}
