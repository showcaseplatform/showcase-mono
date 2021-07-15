import { Resolver, Mutation, Arg, Authorized } from 'type-graphql'

import { toggleLike } from '../libs/badge/toggleLike'
import { ToggleLikeInput, LikeBadgeUnion } from '../libs/badge/types/toggleLike.type'
import { countView } from '../libs/badge/countBadgeView'
import { CountViewInput, ViewBadgeUnion } from '../libs/badge/types/countView.type'
import { BadgeItem } from '@generated/type-graphql'
import { listBadgeForSale } from '../libs/badge/listBadgeForSale'
import { ListBadgeForSaleInput } from '../libs/badge/types/listBadgeForSale.type'
import { unlistBadgeForSale } from '../libs/badge/unlistBadgeForSale'
import { UnListBadgeForSaleInput } from '../libs/badge/types/unlistBadgeForSale.type'
import {
  BadgeTypeLike,
  BadgeItemLike,
  User,
  UserType,
  BadgeTypeView,
  BadgeItemView,
} from '@prisma/client'
import { ViewInfo } from '../libs/badge/types/countView.type'
import { CurrentUser } from '../libs/auth/decorators'
import { allUserTypes } from '../libs/auth/authLib'

@Resolver()
export class InventoryResolver {
  @Authorized(...allUserTypes)
  @Mutation(() => LikeBadgeUnion)
  async toggleLike(
    @Arg('data') countLikeInput: ToggleLikeInput,
    @CurrentUser() currentUser: User
  ): Promise<BadgeTypeLike | BadgeItemLike> {
    return await toggleLike(countLikeInput, currentUser.id)
  }

  @Authorized(...allUserTypes)
  @Mutation(() => ViewBadgeUnion)
  async countView(
    @Arg('data') countViewInput: CountViewInput,
    @CurrentUser() currentUser: User
  ): Promise<ViewInfo | BadgeTypeView | BadgeItemView> {
    return await countView(countViewInput, currentUser.id)
  }

  @Authorized(UserType.collector, UserType.creator)
  @Mutation(() => BadgeItem)
  async listBadgeForSale(
    @Arg('data') listBadgeForSaleInput: ListBadgeForSaleInput,
    @CurrentUser() currentUser: User
  ): Promise<BadgeItem> {
    return await listBadgeForSale(listBadgeForSaleInput, currentUser.id)
  }

  @Authorized(UserType.collector, UserType.creator)
  @Mutation(() => BadgeItem)
  async unlistBadgeForSale(
    @Arg('data') unListBadgeForSaleInput: UnListBadgeForSaleInput,
    @CurrentUser() currentUser: User
  ): Promise<BadgeItem> {
    return await unlistBadgeForSale(unListBadgeForSaleInput, currentUser.id)
  }
}
