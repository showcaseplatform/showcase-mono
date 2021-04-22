const { userAuthenticated } = require('./../../middlewares/userAuthenticated')

const WalletRouter = require('express').Router()
const create = require('./create.js')
const unlock = require('./unlock.js')
const backup = require('./backup.js')
const payoutAccount = require('./payoutAccount.js')
const payoutSend= require('./payoutSend')

WalletRouter.use(userAuthenticated)
WalletRouter.route('/create').post(create)
WalletRouter.route('/unlock').post(unlock)
WalletRouter.route('/backup').post(backup)
WalletRouter.route('/payoutAccount').post(payoutAccount)
WalletRouter.route('/payoutSend').post(payoutSend)

module.exports = WalletRouter
