import { Authorized, Ctx, Field, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql'
import { User } from '@generated/type-graphql'
import { MyContext } from '../services/apollo'
import { isUserAlreadyFollowed } from '../libs/user/toggleFollow'

@Resolver((_of) => User)
export class customUserResolver  {

  @FieldResolver(_ => Boolean)
  async amIFollowing(@Root() user: User, @Ctx() ctx: MyContext) {
    const uid = ctx.user?.id
    if(!uid) return false
    return await isUserAlreadyFollowed({uid, followUserId: user.id})
  }
}
