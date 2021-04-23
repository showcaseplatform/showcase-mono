var convict = require('convict')

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
      default: '14510070',
    },
    token: {
      doc: 'Authorization token for tranferwise account',
      format: String,
      default: 'd0f25271-e191-4205-bdd1-d5187e220a78',
    },
  },
  stripe: {
    doc: 'Key to initialize stripe package',
    format: String,
    default:
      'sk_test_51FzSlvIUYoR902HWvmyEomOVnWNR7GD1wm3foYNP79Yg0UAbRJkKiGfzKZgL8nYZ8ixVTbftmTzQ1CnZs7SEcrRv000Vmq7Ply',
  },
  blockchainServer: {
    doc: 'Url of the blockchain server',
    format: String, // todo: 'url' caused error
    default: 'https://us-central1-showcase-1cc97.cloudfunctions.net/app',
  },
  twilio: {
    account: {
      doc: 'Twillio account id',
      format: String,
      default: 'ACfbccd24814d0194118dc5459db768da7',
    },
    token: {
      doc: 'Twillio authentication token',
      format: String,
      default: '76e74f82f8c94a0c67ddd94862d74629',
    },
    from: {
      doc: 'Twillio messages are sent from this phone number',
      format: String,
      default: '+12056274546',
    },
  },
  algolia: {
    id: {
      doc: 'Algolia ID',
      format: String,
      default: 'JY2ZHM7KLL',
    },
    adminKey: {
      doc: 'Algolia admin key',
      format: String,
      default: '97fb4b7b4da91fac807ad880217272d0',
    },
    searchKey: {
      doc: 'Algolia search key',
      format: String,
      default: '680b059e826b1dc3b6b6d3428bbd09b5', // todo: currently not used anywhere
    },
  },
})

// Load environment dependent configuration
// var env = config.get('env');
// config.loadFile('./config/' + env + '.json');

module.exports = { ...config.getProperties() }
