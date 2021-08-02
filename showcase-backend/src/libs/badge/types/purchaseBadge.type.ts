import { InputType, Field, Int } from 'type-graphql'
import { Min, Max, MaxLength } from 'class-validator'
import { BADGE_TYPE_MAX_SALE_PRICE, BADGE_TYPE_MAX_TITLE_LENGTH, BADGE_TYPE_MIN_SALE_PRICE } from '../../../consts/businessRules'
import { BadgeItemId, BadgeTypeId } from '../../../types/badge'

@InputType({ description: 'Data for purchasing a badge' })
export class PurchaseBadgeInput {
  @Field({nullable: true})
  badgeTypeId?: BadgeTypeId


  @Field({nullable: true})
  badgeItemId?: BadgeItemId


  // todo: add back the inputs when displaye badges in user's currency is implemented
  // @Field((_type) => Int)
  // @Min(0)
  // @Max(1)
  // currencyRate: number

  // @Field((_type) => Int)
  // @Min(BADGE_TYPE_MIN_SALE_PRICE)
  // @Max(BADGE_TYPE_MAX_SALE_PRICE * 2) //todo: how to deal with max price in multiple currency
  // displayedPrice: number
}
