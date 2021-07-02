import S3, { ContentType } from 'aws-sdk/clients/s3'
import config from './config'

interface UploadFileInput {
  Key: string
  ContentType: ContentType
  buffer: Buffer
  hash?: string
}

const s3 = new S3({
  accessKeyId: config.keyId,
  secretAccessKey: config.key,
  region: config.region,
})

export function uploadFileToS3Bucket({ Key, ContentType, buffer, hash }: UploadFileInput) {
  return s3
    .upload({
      Bucket: config.bucket,
      Key,
      ContentType,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentMD5: hash,
    })
    .promise()
}

export function generateSignedUrl(Key: string, expiryInSec?: number) {
  const params = {
    Bucket: config.bucket,
    Key,
    Expires: expiryInSec || 36000,
  }

  return s3.getSignedUrl('getObject', params)
}
