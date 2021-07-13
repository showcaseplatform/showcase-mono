import { FieldResolver, Resolver, Root, Int } from 'type-graphql'
import { Profile } from '@generated/type-graphql'
import { myS3 } from '../services/S3/s3'

@Resolver((_of) => Profile)
export class CustomProfileResolver {
  @FieldResolver((_) => String, {nullable: true})
  async avatarUrl(@Root() profile: Profile) {
    if (profile.avatarId) {
      return myS3.generateSignedUrl(profile.avatarId)
    }
  }
}
