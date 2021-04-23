const { stripe: stripeConfig } = require('../config')
const stripe = require('stripe')(stripeConfig)


module.exports = stripe