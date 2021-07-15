import { FieldResolver, Resolver, Root } from 'type-graphql'
import { Cause } from '@generated/type-graphql'
import { myS3 } from '../services/S3/s3'

@Resolver((_of) => Cause)
export class CustomCauseResolver {
  @FieldResolver((_) => String)
  async imageUrl(@Root() cause: Cause) {
    return myS3.generateSignedUrl(cause.image)
  }
}
