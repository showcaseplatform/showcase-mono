import {
  Resolver,
  Ctx,
  Mutation,
  Arg,
} from 'type-graphql'
import {
  BadgeType,
} from '@generated/type-graphql'

import { publishBadgeType } from '../libs/marketplace/publishBadgeType'
import { PublishBadgeTypeInput } from './types/publishBadgeTypeInput'


// @Resolver((_of) => BadgeType)
@Resolver()
export class MarketplaceTypeResolver {
  @Mutation((_returns) => BadgeType)
  async publishBadgeType(
    @Ctx() ctx: any,
    @Arg('data') publishBadgeTypeInput: PublishBadgeTypeInput
  ): Promise<BadgeType | null> {
    return await publishBadgeType(publishBadgeTypeInput, ctx.user)
  }
}

