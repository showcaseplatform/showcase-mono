import S3 from 'aws-sdk/clients/s3'
import config from './config'

const s3 = new S3({
  accessKeyId: config.keyId,
  secretAccessKey: config.key,
  region: config.region,
})

export function uploadFile({ Key, buffer, hash }: { Key: string; buffer: Buffer; hash: string }) {
  return s3
    .upload({
      Bucket: config.bucket,
      Key,
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
