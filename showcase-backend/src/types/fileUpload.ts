import { Field, InputType } from 'type-graphql'

@InputType()
export class FileUpload {
  @Field()
  fileName: string //todo: why do we need this? if dont delete
  @Field()
  base64DataURL: string
  @Field()
  mimeType: string
}
