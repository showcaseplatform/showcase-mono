import { Resolver, Ctx, Mutation, Arg, Authorized } from 'type-graphql'
import { Follow, Profile } from '@generated/type-graphql'
import { toggleFollow } from '../libs/user/toggleFollow'
import { updateProfile } from '../libs/user/updateProfile'
import { UpdateProfileInput } from '../libs/user/types/updateProfile.type'
import { UserType } from '@prisma/client'

@Resolver()
export class SocialResolver {
  // todo: mutation to accept / decline request eg.: answerFollowRequest
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => Follow)
  async toggleFollow(@Ctx() ctx: any, @Arg('userId') userId: string) {
    return await toggleFollow(userId, ctx.user.id)
  }
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => Profile)
  async updateProfileCustom(@Ctx() ctx: any, @Arg('data') updateProfileInput: UpdateProfileInput) {
    return await updateProfile(updateProfileInput, ctx.user.id)
  }
}
