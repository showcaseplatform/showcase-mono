const { userAuthenticated } = require('./../../middlewares/userAuthenticated')

const CurrencyRouter = require('express').Router()
const rates = require('./rates.js')

CurrencyRouter.use(userAuthenticated)
CurrencyRouter.route('/rates').get(rates)

module.exports = CurrencyRouter