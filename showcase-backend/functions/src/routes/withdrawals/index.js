const { userAuthenticated } = require('./../../middlewares/userAuthenticated')

const WithdrawalsRouter = require('express').Router()
const loadUserWithdrawalsHandler = require('./loadUserWithdrawals.js')

WithdrawalsRouter.use(userAuthenticated)
WithdrawalsRouter.route('/loadUserWithdrawals').get(loadUserWithdrawalsHandler)

module.exports = WithdrawalsRouter