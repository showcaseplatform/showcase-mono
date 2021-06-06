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
import { UserType } from '@prisma/client'

@Resolver()
export class InventoryResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => LikeBadgeUnion)
  async toggleLike(@Ctx() ctx: any, @Arg('data') countLikeInput: ToggleLikeInput) {
    return await toggleLike(countLikeInput, ctx.user.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => ViewBadgeUnion)
  async countView(@Ctx() ctx: any, @Arg('data') countViewInput: CountViewInput) {
    return await countView(countViewInput, ctx.user.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => BadgeItem)
  async listBadgeForSale(
    @Ctx() ctx: any,
    @Arg('data') listBadgeForSaleInput: ListBadgeForSaleInput
  ) {
    return await listBadgeForSale(listBadgeForSaleInput, ctx.user.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => BadgeItem)
  async unlistBadgeForSale(
    @Ctx() ctx: any,
    @Arg('data') unListBadgeForSaleInput: UnListBadgeForSaleInput
  ) {
    return await unlistBadgeForSale(unListBadgeForSaleInput, ctx.user.id)
  }
}
