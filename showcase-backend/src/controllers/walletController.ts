import { userAuthenticated } from '../middlewares/userAuthenticated'
import { backupMnemonicPhrase } from '../libs/payment/backup'
import { unLock } from '../libs/payment/unlock'

const WalletController = require('express').Router()

WalletController.use(userAuthenticated)
WalletController.route('/unlock').post(unLock)
WalletController.route('/backup').post(backupMnemonicPhrase)

export { WalletController }

