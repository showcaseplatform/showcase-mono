import { myS3 } from '../services/S3/s3'
import { FileType, FileUploadInput } from './types/fileUpload.type'
import { v4 as uuidv4 } from 'uuid'
import { GraphQLError } from 'graphql'
import * as crypto from 'crypto'
import { resizeImageWithSharp } from '../services/sharp'

enum FileUploadErrorMessages {
  BadgeWrongFileType = 'Only JPG, JPEG, PNG and GIF files are allowed.',
  AvatarWrongFileType = 'Only JPG, JPEG and PNG files are allowed.',
  MissingFileType = 'FileType musst be specified',
}

export const CAUSES_PATH = 'causes'

export const BADGE_PATH = 'badges'
const BADGE_ALLOWED_FILES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

export const AVATAR_PATH = 'avatars'
const AVATAR_ALLOWED_FILES = ['image/jpeg', 'image/jpg', 'image/png']

type UploadFunction = (
  props: FileUploadInput
) => Promise<{ hash: string; Key: string; gif: boolean }>

export const uploadFile: UploadFunction = async ({ fileData, fileType, updateKey }) => {
  const { base64DataURL, mimeType: ContentType } = fileData

  const fileExtension = ContentType.split('/')[1]

  let buffer = Buffer.from(base64DataURL, 'base64')
  let Key = ''
  let hash = ''
  let gif = false

  switch (fileType) {
    case FileType.badge:
      if (!BADGE_ALLOWED_FILES.includes(ContentType)) {
        throw new GraphQLError(FileUploadErrorMessages.BadgeWrongFileType)
      }
      gif = fileExtension === 'gif'
      Key = `${BADGE_PATH}/${uuidv4()}.${fileExtension}`
      hash = crypto.createHash('md5').update(buffer).digest('base64')
      break

    case FileType.avatar:
      if (!AVATAR_ALLOWED_FILES.includes(ContentType)) {
        throw new GraphQLError(FileUploadErrorMessages.AvatarWrongFileType)
      }
      Key = updateKey || `${AVATAR_PATH}/${uuidv4()}.${fileExtension}`
      buffer = await resizeImageWithSharp({ buffer, width: 100, height: 100 })
      break

    default:
      throw new GraphQLError(FileUploadErrorMessages.MissingFileType)
  }

  await myS3.uploadFileToS3Bucket({
    Key,
    ContentType,
    buffer,
    hash,
  })

  return { hash, Key, gif }
}
