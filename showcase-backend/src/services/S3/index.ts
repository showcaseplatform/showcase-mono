import S3, { ContentType } from 'aws-sdk/clients/s3'
import config from './config'
import { env } from '../../config'

export interface S3UploadInput {
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

const MyBucket = { Bucket: `showcase.to-${env}` }

export const createS3Bucket = () => {
  const params: S3.CreateBucketRequest = {
    ...MyBucket,
    CreateBucketConfiguration: {
      LocationConstraint: 'eu-west-1',
    },
    ACL: 'public-read',
  }
  return s3
    .createBucket(params, (err, _) => {
      if (err) {
        console.log('❗❗ s3.createBucket failed ❗❗')
        console.error({ err })
      } else {
        console.log('✅ New S3 bucket created with name: ', MyBucket.Bucket)
      }
    })
    .promise()
}

const findOrCreateS3Bucket = () => {
  return s3
    .waitFor('bucketExists', MyBucket, async (err, _) => {
      if (err) {
        console.log(`❗❗ ${err.message} ❗❗`)
        await createS3Bucket()
      } else {
        console.log(`✅ ${MyBucket.Bucket} S3 bucketExists check completed`)
      }
    })
    .promise()
}

findOrCreateS3Bucket()

export function uploadFileToS3Bucket({ Key, ContentType, buffer, hash }: S3UploadInput) {
  return s3
    .upload({
      ...MyBucket,
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
    ...MyBucket,
    Key,
    Expires: expiryInSec || 36000,
  }

  return s3.getSignedUrl('getObject', params)
}
