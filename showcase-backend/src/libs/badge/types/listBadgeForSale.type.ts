import { InputType, Field, Float, registerEnumType } from 'type-graphql'
import { BadgeItemId } from '../../../types/badge'
import { Min, Max } from 'class-validator'
import { BADGE_TYPE_MIN_SALE_PRICE, BADGE_TYPE_MAX_SALE_PRICE } from '../../../consts/businessRules'
import { Currency } from '@generated/type-graphql'

@InputType({ description: 'Data for listing a badge for sale' })
export class ListBadgeForSaleInput {
  @Field()
  sig: string

  @Field()
  message: string

  @Field()
  badgeItemId: BadgeItemId

  @Field((_type) => Currency, { nullable: true })
  currency?: Currency

  @Field((_type) => Float)
  @Min(BADGE_TYPE_MIN_SALE_PRICE)
  @Max(BADGE_TYPE_MAX_SALE_PRICE)
  price: number
}
