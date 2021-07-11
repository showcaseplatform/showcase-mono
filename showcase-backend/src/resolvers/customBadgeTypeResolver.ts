import { FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { BadgeType, User } from '@generated/type-graphql'
import { badgeTypeLikeCount, badgeTypeViewCount } from '../libs/database/badgeType.repo'
import { checkIfBadgeAlreadyLiked } from '../libs/badge/toggleLike'
import { CurrentUser } from '../libs/auth/decorators'
import { checkIfBadgeAlreadyViewed } from '../libs/badge/countBadgeView'
import { generateSignedUrl } from '../services/S3'
import { isBadgeTypeSoldOut, isBadgeTypeRemovedFromShowcase } from '../libs/badge/validateBadgeType'

@Resolver(() => BadgeType)
export class CustomBadgeTypeResolver {
  @FieldResolver(() => Boolean)
  async isViewedByMe(
    @Root() badgeType: BadgeType,
    @CurrentUser() currentUser: User
  ): Promise<boolean> {
    const uid = currentUser?.id
    if (!uid) {
      return false
    }
    return await checkIfBadgeAlreadyViewed({ marketplace: true, badgeId: badgeType.id }, uid)
  }

  @FieldResolver(() => Boolean)
  async isLikedByMe(
    @Root() badgeType: BadgeType,
    @CurrentUser() currentUser: User
  ): Promise<boolean> {
    const uid = currentUser?.id
    if (!uid) {
      return false
    }
    return await checkIfBadgeAlreadyLiked({ marketplace: true, badgeId: badgeType.id }, uid)
  }

  @FieldResolver(() => Int)
  async likeCount(@Root() badgeType: BadgeType): Promise<number> {
    return await badgeTypeLikeCount(badgeType.id)
  }

  @FieldResolver(() => Int)
  async viewCount(@Root() badgeType: BadgeType): Promise<number> {
    return await badgeTypeViewCount(badgeType.id)
  }

  @FieldResolver(() => String)
  async publicUrl(@Root() badgeType: BadgeType): Promise<string> {
    return generateSignedUrl(badgeType.imageId)
  }

  @FieldResolver((_) => Boolean)
  async removedFromShowcase(@Root() badgeType: BadgeType) {
    return await isBadgeTypeRemovedFromShowcase(badgeType.id)
  }
  @FieldResolver((_) => Boolean)
  async isSoldOut(@Root() badgeType: BadgeType) {
    return isBadgeTypeSoldOut(badgeType)
  }
}
