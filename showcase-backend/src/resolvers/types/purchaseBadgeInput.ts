import { InputType, Field, Int } from 'type-graphql'
import { Min, Max, MaxLength } from 'class-validator'
import { BADGE_TYPE_MAX_SALE_PRICE, BADGE_TYPE_MAX_TITLE_LENGTH, BADGE_TYPE_MIN_SALE_PRICE } from '../../consts/businessRules'

@InputType({ description: 'Data for purchasing a badge' })
export class PurchaseBadgeInput {
  @Field()
  badgeTypeId: string

  @Field()
  @MaxLength(BADGE_TYPE_MAX_TITLE_LENGTH)
  title: string

  @Field((_type) => Int)
  @Min(0)
  @Max(1)
  currencyRate: number

  @Field((_type) => Int)
  @Min(BADGE_TYPE_MIN_SALE_PRICE)
  @Max(BADGE_TYPE_MAX_SALE_PRICE * 2)
  displayedPrice: number
}
