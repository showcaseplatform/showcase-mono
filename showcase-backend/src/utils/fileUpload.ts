import { uploadFileToS3Bucket } from '../services/S3'
import { FileUpload } from './types/fileUpload.type'
import { v4 as uuidv4 } from 'uuid'
import { GraphQLError } from 'graphql'
import * as crypto from 'crypto'

export enum FileType {
  badge,
  avatar,
}

export interface FileUploadInput {
  fileData: FileUpload
  fileType: FileType
}

const BADGE_ALLOWED_FILES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const AVATAR_ALLOWED_FILES = ['image/jpeg', 'image/jpg', 'image/png']

export const uploadFile = async ({ fileData, fileType }: FileUploadInput) => {
  const { base64DataURL, mimeType: ContentType } = fileData

  const fileExtension = ContentType.split('/')[1]
  const buffer = Buffer.from(base64DataURL, 'base64')

  let Key = ''
  let hash = ''
  let gif = false

  switch (fileType) {
    case FileType.badge:
      if (!BADGE_ALLOWED_FILES.includes(ContentType)) {
        throw new GraphQLError('Only JPG, JPEG, PNG and GIF files are allowed.')
      }
      gif = fileExtension == 'gif'
      Key = `badges/${uuidv4()}.${fileExtension}`
      hash = crypto.createHash('md5').update(buffer).digest('base64')
      break

    case FileType.avatar:
      if (!AVATAR_ALLOWED_FILES.includes(ContentType)) {
        throw new GraphQLError('Only JPG, JPEG and PNG files are allowed.')
      }

      Key = `avatars/${uuidv4()}.${fileExtension}`
      break

    default:
      throw new GraphQLError('FileType musst be specified')
  }

  await uploadFileToS3Bucket({
    Key,
    ContentType,
    buffer,
    hash,
  })

  return { hash, Key, gif }
}
