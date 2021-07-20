import { Ctx, FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { User, BadgeItem } from '@generated/type-graphql'
import { MyContext } from '../services/apollo'
import { isUserAlreadyFollowed } from '../libs/user/toggleFollow'
import { friendsCount, followersCount } from '../libs/user/followCount'
import { UserBadgeItemsForSale, UserBadgeItemsToShow } from '../libs/user/inventory'
import { isUserAllowedToBuy } from '../libs/user/permissions'

@Resolver(() => User)
export class CustomUserResolver {
  @FieldResolver(() => Boolean)
  async amIFollowing(@Root() user: User, @Ctx() ctx: MyContext): Promise<boolean> {
    const uid = ctx.user?.id
    if (!uid) {
      return false
    }
    return await isUserAlreadyFollowed({ uid, followUserId: user.id })
  }

  @FieldResolver(() => Int)
  async followersCount(@Root() user: User): Promise<number> {
    return await followersCount(user.id)
  }

  @FieldResolver(() => Int)
  async friendsCount(@Root() user: User): Promise<number> {
    return await friendsCount(user.id)
  }

  @FieldResolver(() => Boolean)
  async isAllowedToBuy(@Root() user: User): Promise<Boolean> {
    return await isUserAllowedToBuy(user.id)
  }

  // todo: add custom pagination
  @FieldResolver(() => [BadgeItem])
  async badgeItemsToShow(@Root() user: User): Promise<BadgeItem[]> {
    return await UserBadgeItemsToShow(user.id)
  }

  // todo: add custom pagination
  @FieldResolver(() => [BadgeItem])
  async badgeItemsForSale(@Root() user: User): Promise<BadgeItem[]> {
    return await UserBadgeItemsForSale(user.id)
  }
}
