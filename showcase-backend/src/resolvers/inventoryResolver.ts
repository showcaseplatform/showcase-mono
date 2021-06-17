import { Resolver, Ctx, Mutation, Arg, Authorized } from 'type-graphql'

import { toggleLike } from '../libs/badge/toggleLike'
import { ToggleLikeInput, LikeBadgeUnion } from '../libs/badge/types/toggleLike.type'
import { countView } from '../libs/badge/countBadgeView'
import { CountViewInput, ViewBadgeUnion } from '../libs/badge/types/countView.type'
import { BadgeItem } from '@generated/type-graphql'
import { listBadgeForSale } from '../libs/badge/listBadgeForSale'
import { ListBadgeForSaleInput } from '../libs/badge/types/listBadgeForSale.type'
import { unlistBadgeForSale } from '../libs/badge/unlistBadgeForSale'
import { UnListBadgeForSaleInput } from '../libs/badge/types/unlistBadgeForSale.type'
import { User, UserType } from '@prisma/client'
import { CurrentUser } from '../libs/auth/decorators'

@Resolver()
export class InventoryResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => LikeBadgeUnion)
  async toggleLike(@Arg('data') countLikeInput: ToggleLikeInput, @CurrentUser() currentUser: User) {
    return await toggleLike(countLikeInput, currentUser.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => ViewBadgeUnion)
  async countView(@Arg('data') countViewInput: CountViewInput, @CurrentUser() currentUser: User) {
    return await countView(countViewInput, currentUser.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => BadgeItem)
  async listBadgeForSale(
    @Arg('data') listBadgeForSaleInput: ListBadgeForSaleInput,
    @CurrentUser() currentUser: User
  ) {
    return await listBadgeForSale(listBadgeForSaleInput, currentUser.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => BadgeItem)
  async unlistBadgeForSale(
    @Arg('data') unListBadgeForSaleInput: UnListBadgeForSaleInput,
    @CurrentUser() currentUser: User
  ) {
    return await unlistBadgeForSale(unListBadgeForSaleInput, currentUser.id)
  }
}
