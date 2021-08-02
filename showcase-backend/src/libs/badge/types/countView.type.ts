import { InputType, Field, createUnionType, ObjectType } from 'type-graphql'
import { BadgeItemId, BadgeTypeId } from '../../../types/badge'
import { BadgeTypeView, BadgeItemView } from '@generated/type-graphql'

@InputType({ description: 'Data for counting views' })
export class CountViewInput {
  @Field()
  marketplace: boolean

  @Field()
  badgeId: BadgeItemId | BadgeTypeId
}
@ObjectType()
export class ViewInfo {
  @Field()
  info: string;
}

export const ViewBadgeUnion = createUnionType({
  name: "ViewBadgeUnion",
  types: () => [BadgeTypeView, BadgeItemView, ViewInfo] as const,
  resolveType: value => {
    if ("badgeTypeId" in value) {
      return BadgeTypeView; 
    }
    if ("badgeItemId" in value) {
      return BadgeItemView; 
    } 
    return ViewInfo;
  },
});


