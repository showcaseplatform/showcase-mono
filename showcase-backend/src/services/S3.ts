import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'

// todo: move me into config system
const { S3_BUCKETREGION, S3_ACCESS_KEY, S3_SECRET } = process.env

const Bucket = `showcase-badges-development` //${NODE_ENV}

const s3 = new S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET,
  region: S3_BUCKETREGION,
})

export function uploadFile({ path, filename }: Express.Multer.File) {
  const stream = fs.createReadStream(path)

  const params = {
    Bucket,
    Key: filename,
    Body: stream,
  }

  return s3.upload(params).promise()
}

export function loadFileStream(Key: string) {
  const params = {
    Bucket,
    Key,
  }

  return s3.getObject(params).createReadStream()
}
