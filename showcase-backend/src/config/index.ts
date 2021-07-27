import convict from 'convict'

// Add new format
// convict.addFormat(require('convict-format-with-validator').ipaddress)

type ConfigType = {
  env: string
  transferWise: {
    profile: string
    token: string
  }
  stripe: string
  blockchain: {
    server: string
    authToken: string
    enabled: boolean
  }
  twilio: {
    account: string
    token: string
    from: string
  }
  expo: {
    server: string
    token: string
  }
  openExchange: {
    appId: string
    url: string
  }
  jwt: {
    privateKey: string
    expiresIn: string
  }
}

// Define a schema
const config = convict<ConfigType>({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  transferWise: {
    profile: {
      doc: 'Profile id for transferwise account',
      format: String,
      default: '',
      env: 'TRANSFERWISE_PROFILE',
    },
    token: {
      doc: 'Authorization token for tranferwise account',
      format: String,
      default: '',
      env: 'TRANSFERWISE_TOKEN',
    },
  },
  // todo: remove this if we are give up on stripe
  stripe: {
    doc: 'Key to initialize stripe package',
    format: String,
    default: '',
    env: 'STRIPE_KEY',
  },
  blockchain: {
    server: {
      doc: 'Url of the blockchain server',
      format: String, // todo: 'url' caused error
      default: '',
      env: 'BLOCKCHAIN_SERVER',
    },
    authToken: {
      doc: 'Authtentication token for blockchain server',
      format: String,
      default: '',
      env: 'BLOCKCHAIN_AUTH_TOKEN',
    },
    enabled: {
      doc: 'Flag to attach / remove blockchain functionalities',
      format: Boolean,
      default: false,
      env: 'BLOCKCHAIN_ENABLED',
    },
  },
  twilio: {
    account: {
      doc: 'Twillio account id',
      format: String,
      default: '',
      env: 'TWILIO_ACCOUNT',
    },
    token: {
      doc: 'Twillio authentication token',
      format: String,
      default: '',
      env: 'TWILIO_TOKEN',
    },
    from: {
      doc: 'Twillio messages are sent from this phone number',
      format: String,
      default: '',
      env: 'TWILIO_FROM',
    },
  },
  expo: {
    server: {
      doc: 'Url used to send push notifications',
      format: String,
      default: 'https://exp.host/--/api/v2/push/send',
    },
    token: {
      doc: 'Access token if you have enabled push security',
      format: String,
      default: '',
      env: 'EXPO_ACCESS_TOKEN',
    },
  },
  openExchange: {
    appId: {
      doc: 'App id for openexchangerates.org',
      format: String,
      default: '',
      env: 'OPEN_EXCHANGE_RATES_APP_ID',
    },
    url: {
      doc: 'Url for openexchangerates.org',
      format: String,
      default: '',
      env: 'OPEN_EXCHANGE_RATES_URL',
    },
  },
  jwt: {
    privateKey: {
      doc: 'Jwt private key',
      format: String,
      default: '',
      env: 'JWT_PRIVATE_KEY',
    },
    expiresIn: {
      doc: 'Jwt token expiration date',
      format: String,
      default: '7 days',
    },
  },
})

// Load environment dependent configuration
config.loadFile('./src/config/' + config.get('env') + '.json')

// throws error if config does not conform to schema
config.validate({ allowed: 'strict' })
const properties = config.getProperties()

export const env = properties.env
export const transferWise = properties.transferWise
export const stripe = properties.stripe
export const blockchain = properties.blockchain
export const twilio = properties.twilio
export const expo = properties.expo
export const openExchange = properties.openExchange
export const jwt = properties.jwt
