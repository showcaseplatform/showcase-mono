import { InputType, Field, Int } from 'type-graphql'
import { BadgeTypeCreateInput, Category } from '@generated/type-graphql'
import { Min, Max, MaxLength } from 'class-validator'

import { registerEnumType } from 'type-graphql'
import {
  BADGE_TYPE_MIN_SALE_PRICE,
  BADGE_TYPE_MAX_SALE_PRICE,
  BADGE_TYPE_MAX_DESC_LENGTH,
  BADGE_TYPE_MAX_SUPPLY,
  BADGE_TYPE_MAX_TITLE_LENGTH,
  BADGE_TYPE_MIN_SUPPLY,
  DONATION_MAX_AMOUNT,
  DONATION_MIN_AMOUNT,
} from '../../consts/businessRules'

registerEnumType(Category, {
  name: 'Category',
  description: 'Categories which could be selected when creating BadgeType',
})

@InputType({ description: 'Data for publishing a new badgeType' })
export class PublishBadgeTypeInput implements Partial<BadgeTypeCreateInput> {
  @Field()
  id: string

  @Field()
  @MaxLength(BADGE_TYPE_MAX_TITLE_LENGTH)
  title: string

  // todo: what type should price have
  @Field((_type) => Int)
  @Min(BADGE_TYPE_MIN_SALE_PRICE)
  @Max(BADGE_TYPE_MAX_SALE_PRICE)
  price: number

  @Field((_type) => Int)
  @Min(BADGE_TYPE_MIN_SUPPLY)
  @Max(BADGE_TYPE_MAX_SUPPLY)
  supply: number

  @Field({ nullable: true })
  @MaxLength(BADGE_TYPE_MAX_DESC_LENGTH)
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
  @Min(DONATION_MIN_AMOUNT)
  @Max(DONATION_MAX_AMOUNT)
  donationAmount?: number

  @Field()
  gif: boolean
}
