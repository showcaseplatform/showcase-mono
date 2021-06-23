import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { generateSignedUrl } from '../services/S3'

@ObjectType({ description: "Object representing a file" })
export class File {
  @Field()
  filename: String

  @Field()
  mimetype: String

  @Field()
  encoding: String

  @Field()
  size: number

}

@ObjectType({ description: "Object representing a signed URL to AWS S3 images" })
export class SignedUrl {
  @Field()
  url: String
}

@Resolver()
export class FileUploadResolver {
  @Query((_returns) => SignedUrl, { nullable: false })
  getSignedUrl(@Arg('key') key: string) {
    return ({ url: generateSignedUrl(key) })
  }
}
