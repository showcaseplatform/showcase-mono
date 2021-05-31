import {
  Resolver,
  Ctx,
  Mutation,
  Arg,
} from 'type-graphql'
import {
  BadgeType,
  BadgeItem
} from '@generated/type-graphql'

import { publishBadgeType } from '../libs/badge/publishBadgeType'
import { PublishBadgeTypeInput } from '../libs/badge/types/publishBadgeType.type'
import { PurchaseBadgeInput } from '../libs/badge/types/purchaseBadge.type'
import { purchaseBadge } from '../libs/badge/purchaseBadge'


@Resolver()
export class MarketplaceResolver {
  @Mutation((_returns) => BadgeType)
  async publishBadgeType(
    @Ctx() ctx: any,
    @Arg('data') publishBadgeTypeInput: PublishBadgeTypeInput
  ): Promise<BadgeType> {
    return await publishBadgeType(publishBadgeTypeInput, ctx.user)
  }

  @Mutation((_returns) => BadgeItem)
  async purchaseBadge(
    @Ctx() ctx: any,
    @Arg('data') purchaseBadgeInput: PurchaseBadgeInput
  ): Promise<BadgeItem> {
    return await purchaseBadge(purchaseBadgeInput, ctx.user.id)
  }
}

