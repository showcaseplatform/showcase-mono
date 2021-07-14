import 'reflect-metadata'
import { myS3 } from '../src/services/S3/s3'

myS3
  .resetS3Bucket()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
