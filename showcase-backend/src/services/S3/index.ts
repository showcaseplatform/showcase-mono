import S3, { ContentType } from 'aws-sdk/clients/s3'
import s3Config from './config'
import { env } from '../../config'
import { AVATAR_PATH, BADGE_PATH } from '../../utils/fileUpload'

export interface S3UploadInput {
  Key: string
  ContentType: ContentType
  buffer: Buffer
  hash?: string
}

const s3 = new S3({
  accessKeyId: s3Config.keyId,
  secretAccessKey: s3Config.key,
  region: s3Config.region,
})

const MyBucket = { Bucket: `showcase.to-${env}` }

export const createS3Bucket = () => {
  const params: S3.CreateBucketRequest = {
    ...MyBucket,
    CreateBucketConfiguration: {
      LocationConstraint: s3Config.region,
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
        console.log(`✅ S3 bucketExists check completed: ${MyBucket.Bucket} is ready to use`)
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

// export const resetS3Bucket = () => {

//   const params: S3.CopyObjectRequest = {
//     CopySource: {
//       ...MyBucket,
//     }
//   }
//   s3.copyObject(params, (err, data) => {

//   })
// }

export const getListOfS3BucketObjects = async () => {
  const response = await s3.listObjectsV2({ ...MyBucket }).promise()
  const keyList = response.Contents?.map(({ Key }) => Key)
  const avatars =
    keyList?.filter((key) => {
      return key?.split('/')[0] === AVATAR_PATH
    }) || []
  const badges =
    keyList?.filter((key) => {
      return key?.split('/')[0] === BADGE_PATH
    }) || []
  return { avatars, badges }
}
