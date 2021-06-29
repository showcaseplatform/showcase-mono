import { Field, InputType } from 'type-graphql'

@InputType()
export class FileUpload {
  @Field()
  fileName: string
  @Field()
  base64DataURL: string
  @Field()
  mimeType: string
}
