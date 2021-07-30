import { FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { BadgeType, User } from '@generated/type-graphql'
import { badgeTypeLikeCount, badgeTypeViewCount } from '../database/badgeType.repo'
import { checkIfBadgeAlreadyLiked } from '../libs/badge/toggleLike'
import { CurrentUser } from '../libs/auth/decorators'
import { checkIfBadgeAlreadyViewed } from '../libs/badge/countBadgeView'
import { myS3 } from '../services/S3/s3'
import {
  isBadgeTypeSoldOut,
  isBadgeTypeRemovedFromShowcase,
  getAvailableToBuyCount,
  isBadgeTypeOwnedByUser,
  isBadgeTypeCreatedByUser,
} from '../libs/badge/validateBadgePurchase'

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
    return myS3.generateSignedUrl(badgeType.imageId)
  }

  @FieldResolver((_) => Boolean)
  async removedFromShowcase(@Root() badgeType: BadgeType): Promise<boolean> {
    return await isBadgeTypeRemovedFromShowcase(badgeType.id)
  }

  @FieldResolver((_) => Boolean)
  async isSoldOut(@Root() badgeType: BadgeType): Promise<boolean> {
    return await isBadgeTypeSoldOut(badgeType)
  }

  @FieldResolver((_) => Int, { description: 'currently available stock' })
  async availableToBuyCount(@Root() badgeType: BadgeType): Promise<number> {
    return await getAvailableToBuyCount(badgeType)
  }

  @FieldResolver((_) => Boolean)
  isCreatedByMe(@Root() badgeType: BadgeType, @CurrentUser() currentUser: User): boolean {
    const uid = currentUser?.id
    if (!uid) {
      return false
    }
    return isBadgeTypeCreatedByUser(uid, badgeType.creatorId)
  }

  @FieldResolver((_) => Boolean)
  async isOwnedByMe(@Root() badgeType: BadgeType, @CurrentUser() currentUser: User): Promise<boolean> {
    const uid = currentUser?.id
    if (!uid) {
      return false
    }
    return await isBadgeTypeOwnedByUser(uid, badgeType.id)
  }
}
