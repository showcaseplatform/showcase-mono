import { InputType, Field } from 'type-graphql'
import { BadgeItemId } from '../../../types/badge'


@InputType({ description: 'Data for unlisting a badge from sale' })
export class UnListBadgeForSaleInput {
  @Field()
  badgeItemId: BadgeItemId
}
