import S3, { ContentType } from 'aws-sdk/clients/s3'
import s3Config from './config'
import { env } from '../../config'
import { AVATAR_PATH, BADGE_PATH, CAUSES_PATH } from '../../utils/fileUpload'
import Bluebird from 'bluebird'

export interface S3UploadInput {
  Key: string
  ContentType: ContentType
  buffer: Buffer
  hash?: string
}

interface Bucket {
  Bucket: string
}

export const seedBucket: Bucket = { Bucket: `showcase.to-seed` }
class MyS3 {
  s3 = new S3({
    accessKeyId: s3Config.keyId,
    secretAccessKey: s3Config.key,
    region: s3Config.region,
  })

  envBucket: Bucket = { Bucket: `showcase.to-${env}` }
  seedBucket = seedBucket
  ACL = 'public-read' // used for all buckets

  constructor() {
    // todo: remove this line if not neccesary to check bucket exists on every server start
    this.findOrCreateS3Bucket()
  }

  createS3Bucket = () => {
    const params: S3.CreateBucketRequest = {
      ...this.envBucket,
      CreateBucketConfiguration: {
        LocationConstraint: s3Config.region,
      },
      ACL: this.ACL,
    }
    return this.s3
      .createBucket(params, (err, _) => {
        if (err) {
          console.log('❗❗ s3.createBucket failed ❗❗')
          console.error({ err })
        } else {
          console.log('✅ New S3 bucket created with name: ', this.envBucket.Bucket)
        }
      })
      .promise()
  }

  findOrCreateS3Bucket = () => {
    return this.s3
      .waitFor('bucketExists', this.envBucket, async (err, _) => {
        if (err) {
          console.log(`❗❗ ${err.message} ❗❗`)
          await this.createS3Bucket()
        } else {
          console.log(
            `✅ S3 bucketExists check completed: ${this.envBucket.Bucket} is ready to use`
          )
        }
      })
      .promise()
  }

  uploadFileToS3Bucket = ({ Key, ContentType, buffer, hash }: S3UploadInput) => {
    return this.s3
      .upload({
        ...this.envBucket,
        Key,
        ContentType,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentMD5: hash,
      })
      .promise()
  }

  generateSignedUrl = (Key: string, expiryInSec?: number) => {
    const params = {
      ...this.envBucket,
      Key,
      Expires: expiryInSec || 36000,
    }

    return this.s3.getSignedUrl('getObject', params)
  }

  getListOfS3BucketObjects = async (inputBucker: Bucket) => {
    // returns a list of up to 1000 objects stored in Bucket
    const response = await this.s3.listObjectsV2({ ...inputBucker }).promise()
    const objectList = response.Contents?.filter((o) => !!o.Key?.split('/')[1]) || []
    const keyList = objectList?.map(({ Key }) => Key) || []
    const avatars =
      keyList?.filter((key) => {
        return key?.split('/')[0] === AVATAR_PATH
      }) || []
    const badges =
      keyList?.filter((key) => {
        return key?.split('/')[0] === BADGE_PATH
      }) || []
    const causes =
      keyList?.filter((key) => {
        return key?.split('/')[0] === CAUSES_PATH
      }) || []
    return { objectList, avatars, badges, causes }
  }

  deleteS3BucketObjects = async () => {
    const { objectList } = await this.getListOfS3BucketObjects(this.envBucket)

    if (objectList.length === 0) {
      console.log(`❗❗ ${this.envBucket.Bucket} bucket is empty ❗❗`)
      return
    }

    const deleteObjects = objectList.map(({ Key }) => {
      if (Key) return { Key }
    }) as S3.ObjectIdentifierList

    const params: S3.DeleteObjectsRequest = {
      ...this.envBucket,
      Delete: { Objects: [...deleteObjects] },
    }

    await this.s3
      .deleteObjects(params, (err, _) => {
        if (err) {
          console.log(`❗❗ Failed to delete objects from ${this.envBucket.Bucket} ❗❗`, { err })
          throw err
        } else {
          console.log(`✅ Objects successfully deleted from: ${this.envBucket.Bucket}`)
        }
      })
      .promise()
  }

  resetS3Bucket = async () => {
    try {
      await this.deleteS3BucketObjects()
      const { objectList: seedObjectList } = await this.getListOfS3BucketObjects(this.seedBucket)
      await Bluebird.map(seedObjectList, async ({ Key }) => {
        if (Key) {
          const params: S3.CopyObjectRequest = {
            ...this.envBucket,
            CopySource: encodeURI(`${this.seedBucket.Bucket}/${Key}`),
            Key,
          }

          await this.s3
            .copyObject(params, (err, _) => {
              if (err) {
                throw err
              }
            })
            .promise()
        }
      })

      console.log(`✅ Successfully reseted: ${this.envBucket.Bucket} bucket`)
    } catch (err) {
      console.log(`❗❗ Failed to reset ${this.envBucket.Bucket} bucket ❗❗`, { err })
      throw err
    }
  }
}

export const myS3 = new MyS3()
