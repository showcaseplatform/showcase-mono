import { userAuthenticated } from '../middlewares/userAuthenticated'
import { getCauses } from '../libs/causes/causes'
import express from 'express'

const CausesController = express.Router()

CausesController.use(userAuthenticated)
CausesController.route('').get(getCauses)

export { CausesController }
