import { InputType, Field, createUnionType } from 'type-graphql'
import { BadgeItemId, BadgeTypeId } from '../../../types/badge'
import { BadgeTypeLike, BadgeItemLike } from '@generated/type-graphql'

@InputType({ description: 'Data for counting likes' })
export class ToggleLikeInput {
  @Field()
  marketplace: boolean

  @Field()
  badgeId: BadgeItemId | BadgeTypeId
}

export const LikeBadgeUnion = createUnionType({
  name: "LikeBadgeUnion",
  types: () => [BadgeTypeLike, BadgeItemLike] as const,
  resolveType: value => {
    if ("badgeTypeId" in value) {
      return BadgeTypeLike; 
    }
    if ("badgeItemId" in value) {
      return BadgeItemLike; 
    }
    return undefined;
  },
});


