import { Field, InputType } from 'type-graphql'

export enum FileType {
  badge,
  avatar,
}

export interface FileUploadInput {
  fileData: FileUpload
  fileType: FileType,
  updateKey?: string
}

@InputType()
export class FileUpload {
  @Field()
  base64DataURL: string
  @Field()
  mimeType: string
}
