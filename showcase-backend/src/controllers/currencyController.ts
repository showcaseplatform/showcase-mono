import { userAuthenticated } from '../middlewares/userAuthenticated'
import { getCurrencyRates } from '../libs/currency/rates'
import express from 'express'


const CurrencyController = express.Router()

CurrencyController.use(userAuthenticated)
CurrencyController.route('/rates').get(getCurrencyRates)

export { CurrencyController }
