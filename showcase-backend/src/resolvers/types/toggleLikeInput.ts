import { InputType, Field, createUnionType } from 'type-graphql'
import { BadgeItemId, BadgeTypeId } from '../../types/badge'
import { LikeBadgeType, LikeBadge } from '@generated/type-graphql'

@InputType({ description: 'Data for counting likes' })
export class ToggleLikeInput {
  @Field()
  marketplace: boolean

  @Field()
  badgeId: BadgeItemId | BadgeTypeId
}

export const LikeBadgeUnion = createUnionType({
  name: "LikeBadgeUnion",
  types: () => [LikeBadgeType, LikeBadge] as const,
  resolveType: value => {
    if ("badgeTypeId" in value) {
      return LikeBadgeType; 
    }
    if ("badgeItemId" in value) {
      return LikeBadge; 
    }
    return undefined;
  },
});


