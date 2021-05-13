import { userAuthenticated } from '../middlewares/userAuthenticated'
import loadUserWithdrawalsHandler from '../libs/withdrawals/loadUserWithdrawals'

const WithdrawalsController = require('express').Router()

WithdrawalsController.use(userAuthenticated)
WithdrawalsController.route('/loadUserWithdrawals').get(loadUserWithdrawalsHandler)

export {  WithdrawalsController }
