import { uploadFileToS3Bucket } from '../services/S3'
import { FileType, FileUploadInput } from './types/fileUpload.type'
import { v4 as uuidv4 } from 'uuid'
import { GraphQLError } from 'graphql'
import * as crypto from 'crypto'

enum FileUploadErrorMessages {
  BadgeWrongFileType = 'Only JPG, JPEG, PNG and GIF files are allowed.',
  AvatarWrongFileType = 'Only JPG, JPEG and PNG files are allowed.',
  MissingFileType = 'FileType musst be specified',
}

const BADGE_PATH = 'badges/'
const BADGE_ALLOWED_FILES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const AVATAR_PATH = 'avatars/'
const AVATAR_ALLOWED_FILES = ['image/jpeg', 'image/jpg', 'image/png']

export const uploadFile = async ({ fileData, fileType, updateKey }: FileUploadInput) => {
  const { base64DataURL, mimeType: ContentType } = fileData

  const fileExtension = ContentType.split('/')[1]
  const buffer = Buffer.from(base64DataURL, 'base64')

  let Key = ''
  let hash = ''
  let gif = false

  switch (fileType) {
    case FileType.badge:
      if (!BADGE_ALLOWED_FILES.includes(ContentType)) {
        throw new GraphQLError(FileUploadErrorMessages.BadgeWrongFileType)
      }
      gif = fileExtension == 'gif'
      Key = `${BADGE_PATH + uuidv4()}.${fileExtension}`
      hash = crypto.createHash('md5').update(buffer).digest('base64')
      break

    case FileType.avatar:
      if (!AVATAR_ALLOWED_FILES.includes(ContentType)) {
        throw new GraphQLError(FileUploadErrorMessages.AvatarWrongFileType)
      }
      Key = updateKey || `${AVATAR_PATH + uuidv4()}.${fileExtension}`
      break

    default:
      throw new GraphQLError(FileUploadErrorMessages.MissingFileType)
  }

  await uploadFileToS3Bucket({
    Key,
    ContentType,
    buffer,
    hash,
  })

  return { hash, Key, gif }
}
