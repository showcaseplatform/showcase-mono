import { userAuthenticated } from '../middlewares/userAuthenticated'
import create from '../libs/wallet/create'
import unlock from '../libs/wallet/unlock'
import backup from '../libs/wallet/backup'
import payoutAccount from '../libs/wallet/payoutAccount'
import payoutSend from '../libs/wallet/payoutSend'

const WalletController = require('express').Router()

WalletController.use(userAuthenticated)
WalletController.route('/create').post(create)
WalletController.route('/unlock').post(unlock)
WalletController.route('/backup').post(backup)
WalletController.route('/payoutAccount').post(payoutAccount)
WalletController.route('/payoutSend').post(payoutSend)

export { WalletController }
