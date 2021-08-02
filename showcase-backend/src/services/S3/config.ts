import convict from 'convict'

// import config to make sure its linked with dotenv
import * as dotenv from 'dotenv'
import { join } from 'path'
process.chdir(join(__dirname, '../../..'))
const dotenvPath = join(__dirname, '../../..', `.env.${process.env.NODE_ENV}`)
dotenv.config({ path: dotenvPath })

type ConfigType = {
  region: string
  keyId: string
  key: string
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
})

// throws error if config does not conform to schema
config.validate({ allowed: 'strict' })

export default config.getProperties()
