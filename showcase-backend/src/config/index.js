var convict = require('convict')
require('dotenv').config()

// Add new format
// convict.addFormat(require('convict-format-with-validator').ipaddress)

// Define a schema
var config = convict({
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
      default: '',
      env: 'BLOCKCHAIN_ENABLED',
    },
  },
  // todo: twilio got replaced with authy-client
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
  algolia: {
    id: {
      doc: 'Algolia ID',
      format: String,
      default: '',
      env: 'ALGOLIA_ID',
    },
    adminKey: {
      doc: 'Algolia admin key',
      format: String,
      default: '',
      env: 'ALGOLIA_ADMIN_KEY',
    },
    // todo: currently searchKey not used anywhere
    searchKey: {
      doc: 'Algolia search key',
      format: String,
      default: '',
      env: 'ALGOLIA_SEARCH_KEY',
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
      env: 'EXPO_ACCESS_TOKEN'
    }
  },
  openExchange: {
    appId: {
      doc: 'App id for openexchangerates.org',
      format: String,
      default: '',
      env: 'OPEN_EXCHANGE_RATES_APP_ID'
    },
    url: {
      doc: 'Url for openexchangerates.org',
      format: String,
      default: '',
      env: 'OPEN_EXCHANGE_RATES_URL'
    }
  }
})

// Load environment dependent configuration
// const env = config.get('env');
// config.loadFile('./config/' + env + '.json');

// throws error if config does not conform to schema
config.validate({ allowed: 'strict' })

module.exports = { ...config.getProperties() }
