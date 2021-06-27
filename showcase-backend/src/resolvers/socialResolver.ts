import { Resolver, Mutation, Arg, Authorized } from 'type-graphql'
import { Follow, Profile } from '@generated/type-graphql'
import { toggleFollow } from '../libs/user/toggleFollow'
import { updateProfile } from '../libs/user/updateProfile'
import { UpdateProfileInput } from '../libs/user/types/updateProfile.type'
import { User, UserType } from '@prisma/client'
import { CurrentUser } from '../libs/auth/decorators'

@Resolver()
export class SocialResolver {
  // todo: mutation to accept / decline request eg.: answerFollowRequest
  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => Follow)
  async toggleFollow(
    @CurrentUser() currentUser: User,
    @Arg('userId') userId: string
  ): Promise<Follow> {
    return await toggleFollow(userId, currentUser.id)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => Profile)
  async updateProfileCustom(
    @CurrentUser() currentUser: User,
    @Arg('data') updateProfileInput: UpdateProfileInput
  ): Promise<Profile> {
    return await updateProfile(updateProfileInput, currentUser.id)
  }
}
