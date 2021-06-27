import S3 from 'aws-sdk/clients/s3'
import { ReadStream } from 'fs'

// todo: move me into config system
const { S3_BUCKETREGION, S3_ACCESS_KEY, S3_SECRET } = process.env

const Bucket = `showcase-badges-dev` //${NODE_ENV}

const s3 = new S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET,
  region: S3_BUCKETREGION,
})

export function uploadFile({ Key, stream }: { Key: string, stream: ReadStream }) {
  const params = {
    Bucket,
    Key,
    Body: stream,
  }

  return s3.upload(params).promise()
}

export function generateSignedUrl(Key: string, expiryInSec?: number) {
  const params = {
    Bucket,
    Key,
    Expires: expiryInSec || 36000
  }

  return s3.getSignedUrl('getObject', params)
}

// export function loadFileStream(Key: string) {
//   const params = {
//     Bucket,
//     Key,
//   }

//   return s3.getObject(params).createReadStream()
// }
