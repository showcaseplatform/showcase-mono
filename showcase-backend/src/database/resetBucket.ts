import 'reflect-metadata'
import { myS3 } from '../services/S3/s3'

myS3
  .resetS3Bucket()
  .then(() => {
    return process.exit(0)
  })
  .catch((e: any) => {
    console.error(e)
    process.exit(1)
  })
