import { Resolver, Mutation, Arg, Authorized } from 'type-graphql'
import { Follow, Profile } from '@generated/type-graphql'
import { toggleFollow } from '../libs/user/toggleFollow'
import { updateProfile } from '../libs/user/updateProfile'
import { UpdateProfileInput } from '../libs/user/types/updateProfile.type'
import { User, UserType } from '@prisma/client'
import { CurrentUser } from '../libs/auth/decorators'
import { FileUpload } from '../utils/types/fileUpload.type'
import { allUserTypes } from '../libs/auth/authLib'

@Resolver()
export class SocialResolver {
  // todo: mutation to accept / decline request eg.: answerFollowRequest
  @Authorized(...allUserTypes)
  @Mutation(() => Follow)
  async toggleFollow(
    @CurrentUser() currentUser: User,
    @Arg('userId') userId: string
  ): Promise<Follow> {
    return await toggleFollow(userId, currentUser.id)
  }

  @Authorized(...allUserTypes)
  @Mutation(() => Profile)
  async updateProfileCustom(
    @Arg('data', { nullable: true }) updateProfileInput: UpdateProfileInput,
    @Arg('file', { nullable: true }) avatarImg: FileUpload,
    @CurrentUser() currentUser: User
  ) {
    return await updateProfile(updateProfileInput, avatarImg, currentUser.id)
  }
}
