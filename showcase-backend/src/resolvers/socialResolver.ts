import { Resolver, Ctx, Mutation, Arg } from 'type-graphql'
import { Follow, Profile } from '@generated/type-graphql'

import { toggleFollow } from '../libs/user/toggleFollow'
import { ToggleFollowInput } from '../libs/user/types/toggleFollow.type'
import { updateProfile } from '../libs/user/updateProfile'
import { UpdateProfileInput } from '../libs/user/types/updateProfile.type'

@Resolver()
export class SocialResolver {
  // todo: mutation to accept / decline request eg.: answerFollowRequest
  @Mutation((_returns) => Follow)
  async toggleFollow(@Ctx() ctx: any, @Arg('data') toggleFollowInput: ToggleFollowInput) {
    return await toggleFollow(toggleFollowInput, ctx.user.id)
  }

  @Mutation((_returns) => Profile)
  async updateProfileCustom(@Ctx() ctx: any, @Arg('data') updateProfileInput: UpdateProfileInput) {
    return await updateProfile(updateProfileInput, ctx.user.id)
  }
}