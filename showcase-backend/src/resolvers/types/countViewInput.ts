import { InputType, Field, createUnionType, ObjectType } from 'type-graphql'
import { BadgeId, BadgeTypeId } from '../../types/badge'
import { ViewBadgeType, ViewBadge } from '@generated/type-graphql'

@InputType({ description: 'Data for counting views' })
export class CountViewInput {
  @Field()
  marketplace: boolean

  @Field()
  badgeId: BadgeId | BadgeTypeId
}

@ObjectType()
export class ViewInfo {
  @Field()
  info: string;
}

export const ViewBadgeUnion = createUnionType({
  name: "ViewBadgeUnion",
  types: () => [ViewBadgeType, ViewBadge, ViewInfo] as const,
  resolveType: value => {
    if ("badgeTypeId" in value) {
      return ViewBadgeType; 
    }
    if ("badgeId" in value) {
      return ViewBadge; 
    } 
    return ViewInfo;
  },
});


