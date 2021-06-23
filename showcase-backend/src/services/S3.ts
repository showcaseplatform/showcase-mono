import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'

// todo: move me into config system
const { S3_BUCKETREGION, S3_ACCESS_KEY, S3_SECRET, S3_BUCKETNAME } = process.env

const s3 = new S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET,
  region: S3_BUCKETREGION,
})

export function uploadFile(file: Express.Multer.File) {
  const stream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: S3_BUCKETNAME as string,
    Key: file.filename,
    Body: stream,
  }

  return s3.upload(uploadParams).promise()
}

export function loadFileStream(key: string) {
  const downloadParams = {
    Key: key,
    Bucket: S3_BUCKETNAME as string
  }

  return s3.getObject(downloadParams).createReadStream()
}
