import { InputType, Field, Int, Float } from 'type-graphql'
import { BadgeTypeCreateInput, Category, Currency } from '@generated/type-graphql'
import { Min, Max, MaxLength } from 'class-validator'
import {
  BADGE_TYPE_MIN_SALE_PRICE,
  BADGE_TYPE_MAX_SALE_PRICE,
  BADGE_TYPE_MAX_DESC_LENGTH,
  BADGE_TYPE_MAX_SUPPLY,
  BADGE_TYPE_MAX_TITLE_LENGTH,
  BADGE_TYPE_MIN_SUPPLY,
  DONATION_MAX_AMOUNT,
  DONATION_MIN_AMOUNT,
} from '../../../consts/businessRules'

// todo: validations are not tiggered
@InputType({ description: 'Data for publishing a new badgeType' })
export class PublishBadgeTypeInput implements Partial<BadgeTypeCreateInput> {
  @Field()
  @MaxLength(BADGE_TYPE_MAX_TITLE_LENGTH)
  title: string

  @Field((_type) => Float)
  @Min(BADGE_TYPE_MIN_SALE_PRICE)
  @Max(BADGE_TYPE_MAX_SALE_PRICE)
  price: number

  @Field((_type) => Currency, { nullable: true })
  @Min(BADGE_TYPE_MIN_SALE_PRICE)
  @Max(BADGE_TYPE_MAX_SALE_PRICE)
  currency: Currency

  @Field((_type) => Int)
  @Min(BADGE_TYPE_MIN_SUPPLY)
  @Max(BADGE_TYPE_MAX_SUPPLY)
  supply: number

  @Field({ nullable: true })
  @MaxLength(BADGE_TYPE_MAX_DESC_LENGTH)
  description?: string

  @Field((_type) => Category)
  category: Category

  @Field((_type) => Int, { nullable: true })
  causeId?: number

  @Field((_type) => Float, { nullable: true })
  @Min(DONATION_MIN_AMOUNT)
  @Max(DONATION_MAX_AMOUNT)
  donationAmount?: number

  @Field()
  gif: boolean
}
