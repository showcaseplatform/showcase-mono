import S3 from 'aws-sdk/clients/s3'

// todo: move me into config system
const { DEV_AWS_REGION, DEV_AWS_ACCESS_KEY_ID, DEV_AWS_SECRET_ACCESS_KEY, DEV_AWS_S3_BUCKET } = process.env

const Bucket = DEV_AWS_S3_BUCKET as string

const s3 = new S3({
  accessKeyId: DEV_AWS_ACCESS_KEY_ID,
  secretAccessKey: DEV_AWS_SECRET_ACCESS_KEY,
  region: DEV_AWS_REGION,
})

export function uploadFile({ Key, buffer }: { Key: string; buffer: Buffer }) {
  const params = {
    Bucket,
    Key,
    Body: buffer,
    ContentEncoding: 'base64',
    // ACL: 'public-read-write',
  }

  return s3.upload(params).promise()
}

export function generateSignedUrl(Key: string, expiryInSec?: number) {
  const params = {
    Bucket,
    Key,
    Expires: expiryInSec || 36000,
  }

  return s3.getSignedUrl('getObject', params)
}
