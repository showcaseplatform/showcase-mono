import { InputType, Field, createUnionType } from 'type-graphql'
import { BadgeId, BadgeTypeId } from '../../types/badge'
import { LikeBadgeType, LikeBadge } from '@generated/type-graphql'

@InputType({ description: 'Data for counting likes' })
export class ToggleLikeInput {
  @Field()
  marketplace: boolean

  @Field()
  badgeId: BadgeId | BadgeTypeId
}

export const LikeBadgeUnion = createUnionType({
  name: "LikeBadgeUnion",
  types: () => [LikeBadgeType, LikeBadge] as const,
  resolveType: value => {
    if ("badgeTypeId" in value) {
      return LikeBadgeType; 
    }
    if ("badgeId" in value) {
      return LikeBadge; 
    }
    return undefined;
  },
});


