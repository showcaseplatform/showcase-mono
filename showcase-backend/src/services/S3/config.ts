import convict from 'convict'

type ConfigType = {
  region: string
  keyId: string
  key: string
  bucket: string
}

// Define a schema
const config = convict<ConfigType>({
  region: {
    format: String,
    default: '',
    env: 'DEV_AWS_REGION',
  },
  keyId: {
    format: String,
    default: '',
    env: 'DEV_AWS_ACCESS_KEY_ID',
  },
  key: {
    format: String,
    default: '',
    env: 'DEV_AWS_SECRET_ACCESS_KEY',
  },
  bucket: {
    format: String,
    default: '',
    env: 'DEV_AWS_S3_BUCKET',
  },
})

// throws error if config does not conform to schema
config.validate({ allowed: 'strict' })

export default config.getProperties()
