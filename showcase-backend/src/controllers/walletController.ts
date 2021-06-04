import { userAuthenticated } from '../middlewares/userAuthenticated'
// import create from '../libs/wallet/createCryptoWallet'
import unlock from '../libs/payment/unlock'
// import backup from '../libs/wallet/backup'
// import payoutAccount from '../libs/payment/createTransferwiseAccount'
import payoutSend from '../libs/payment/payoutSend'

const WalletController = require('express').Router()

WalletController.use(userAuthenticated)
// WalletController.route('/create').post(create)
WalletController.route('/unlock').post(unlock)
// WalletController.route('/backup').post(backup)
// WalletController.route('/payoutAccount').post(payoutAccount)
WalletController.route('/payoutSend').post(payoutSend)

export { WalletController }
