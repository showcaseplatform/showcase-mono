import { Ctx, FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { User, BadgeItem } from '@generated/type-graphql'
import { MyContext } from '../services/apollo'
import { isUserAlreadyFollowed } from '../libs/user/toggleFollow'
import { friendsCount, followersCount } from '../libs/user/followCount'
import { UserBadgeItemsForSale, UserBadgeItemsToShow } from '../libs/user/inventory'

@Resolver((_of) => User)
export class CustomUserResolver {
  @FieldResolver((_) => Boolean)
  async amIFollowing(@Root() user: User, @Ctx() ctx: MyContext) {
    const uid = ctx.user?.id
    if (!uid) {
      return false
    }
    return await isUserAlreadyFollowed({ uid, followUserId: user.id })
  }

  @FieldResolver((_) => Int)
  async followersCount(@Root() user: User) {
    return await followersCount(user.id)
  }

  @FieldResolver((_) => Int)
  async friendsCount(@Root() user: User) {
    return await friendsCount(user.id)
  }

  // todo: add custom pagination
  @FieldResolver((_) => [BadgeItem])
  async badgeItemsToShow(@Root() user: User) {
    return await UserBadgeItemsToShow(user.id)
  }

  // todo: add custom pagination
  @FieldResolver((_) => [BadgeItem])
  async badgeItemsForSale(@Root() user: User) {
    return await UserBadgeItemsForSale(user.id)
  }
}
