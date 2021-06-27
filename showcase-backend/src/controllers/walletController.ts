import { backupMnemonicPhrase } from '../libs/payment/backup'
import { unLock } from '../libs/payment/unlock'

import express from 'express'

const WalletController = express.Router()

WalletController.route('/unlock').post(unLock)
WalletController.route('/backup').post(backupMnemonicPhrase)

export { WalletController }
