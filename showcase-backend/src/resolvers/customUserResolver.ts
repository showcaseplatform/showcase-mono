import { Ctx, FieldResolver, Int, Resolver, Root } from 'type-graphql'
import { User } from '@generated/type-graphql'
import { MyContext } from '../services/apollo'
import { isUserAlreadyFollowed } from '../libs/user/toggleFollow'
import { friendsCount, followersCount } from '../libs/user/followCount'

@Resolver((_of) => User)
export class customUserResolver {
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
}
