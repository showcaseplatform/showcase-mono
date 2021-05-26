import { Resolver, Ctx, Mutation, Arg } from 'type-graphql'

import { toggleLike } from '../libs/badge/toggleLike'
import { ToggleLikeInput, LikeBadgeUnion } from './types/toggleLikeInput'
import { countView } from '../libs/badge/countView'
import { CountViewInput, ViewBadgeUnion } from './types/countViewInput'
import { BadgeItem } from '@generated/type-graphql'
import { listBadgeForSale } from '../libs/badge/listBadgeForSale'
import { ListBadgeForSaleInput } from './types/listBadgeForSaleInput'
import { unlistBadgeForSale } from '../libs/badge/unlistBadgeForSale'
import { UnListBadgeForSaleInput } from './types/unlistBadgeForSaleInput'

@Resolver()
export class InventoryResolver {
  @Mutation((_returns) => LikeBadgeUnion)
  async toggleLike(@Ctx() ctx: any, @Arg('data') countLikeInput: ToggleLikeInput) {
    return await toggleLike(countLikeInput, ctx.user.id)
  }

  @Mutation((_returns) => ViewBadgeUnion)
  async countView(@Ctx() ctx: any, @Arg('data') countViewInput: CountViewInput) {
    return await countView(countViewInput, ctx.user.id)
  }

  @Mutation((_returns) => BadgeItem)
  async listBadgeForSale(
    @Ctx() ctx: any,
    @Arg('data') listBadgeForSaleInput: ListBadgeForSaleInput
  ) {
    return await listBadgeForSale(listBadgeForSaleInput, ctx.user.id)
  }

  @Mutation((_returns) => BadgeItem)
  async unlistBadgeForSale(
    @Ctx() ctx: any,
    @Arg('data') unListBadgeForSaleInput: UnListBadgeForSaleInput
  ) {
    return await unlistBadgeForSale(unListBadgeForSaleInput, ctx.user.id)
  }
}
