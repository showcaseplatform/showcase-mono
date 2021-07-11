import { FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { BadgeItem, User } from '@generated/type-graphql'
import { checkIfBadgeAlreadyLiked } from '../libs/badge/toggleLike'
import { CurrentUser } from '../libs/auth/decorators'
import { checkIfBadgeAlreadyViewed } from '../libs/badge/countBadgeView'
import { badgeItemLikeCount, badgeItemViewCount } from '../libs/database/badgeItem.repo'

@Resolver((_of) => BadgeItem)
export class CustomBadgeItemResolver {
  @FieldResolver((_) => Boolean)
  async isViewedByMe(@Root() badgeItem: BadgeItem, @CurrentUser() currentUser: User) {
    const uid = currentUser?.id
    if (!uid) {
      return false
    }
    return await checkIfBadgeAlreadyViewed({ marketplace: false, badgeId: badgeItem.id }, uid)
  }

  @FieldResolver((_) => Boolean)
  async isLikedByMe(@Root() badgeItem: BadgeItem, @CurrentUser() currentUser: User) {
    const uid = currentUser?.id
    if (!uid) {
      return false
    }
    return await checkIfBadgeAlreadyLiked({ marketplace: false, badgeId: badgeItem.id }, uid)
  }

  @FieldResolver((_) => Int)
  async likeCount(@Root() badgeItem: BadgeItem) {
    return await badgeItemLikeCount(badgeItem.id)
  }

  @FieldResolver((_) => Int)
  async viewCount(@Root() badgeItem: BadgeItem) {
    return await badgeItemViewCount(badgeItem.id)
  }
}
