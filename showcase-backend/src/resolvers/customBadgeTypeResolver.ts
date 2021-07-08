import { FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { BadgeType, User } from '@generated/type-graphql'
import { badgeTypeLikeCount, badgeTypeViewCount } from '../libs/database/badgeType.repo'
import { checkIfBadgeAlreadyLiked } from '../libs/badge/toggleLike'
import { CurrentUser } from '../libs/auth/decorators'
import { checkIfBadgeAlreadyViewed } from '../libs/badge/countBadgeView'
import { generateSignedUrl } from '../services/S3'

@Resolver((_of) => BadgeType)
export class CustomBadgeTypeResolver {
  @FieldResolver((_) => Boolean)
  async isViewedByMe(@Root() badgeType: BadgeType, @CurrentUser() currentUser: User) {
    const uid = currentUser?.id
    if (!uid) return false
    return await checkIfBadgeAlreadyViewed({ marketplace: true, badgeId: badgeType.id }, uid)
  }

  @FieldResolver((_) => Boolean)
  async isLikedByMe(@Root() badgeType: BadgeType, @CurrentUser() currentUser: User) {
    const uid = currentUser?.id
    if (!uid) return false
    return await checkIfBadgeAlreadyLiked({ marketplace: true, badgeId: badgeType.id }, uid)
  }

  @FieldResolver((_) => Int)
  async likeCount(@Root() badgeType: BadgeType) {
    return await badgeTypeLikeCount(badgeType.id)
  }

  @FieldResolver((_) => Int)
  async viewCount(@Root() badgeType: BadgeType) {
    return await badgeTypeViewCount(badgeType.id)
  }

  @FieldResolver((_) => String)
  async publicUrl(@Root() badgeType: BadgeType) {
    return generateSignedUrl(badgeType.imageId)
  }
}
