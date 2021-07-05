import { Field, InputType } from 'type-graphql'

@InputType()
export class FileUpload {
  @Field()
  base64DataURL: string
  @Field()
  mimeType: string
}
