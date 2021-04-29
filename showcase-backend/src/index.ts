// import services
import { functions } from './services/firestore'

// Import triggers
import { badgeSaleWriteTrigger } from './triggers/badgeSaleWrite'
import { userDeletionTrigger } from './triggers/userDeletion'
import { onUserWriteTrigger } from './triggers/userWrite'
import { badgeSaleDeletionTrigger } from './triggers/badgeSaleIndexDeletion'
import { followerCreateTrigger } from './triggers/followerCreate'

// Import jobs
import { updateExchangeRatesJob } from './jobs/updateExchangeRates'

// Import middlewares
import { globalErrorHandler } from './middlewares/globalErrorHandler'

// Set up api server
import express from 'express'
const cookieParser = require('cookie-parser')()
const cors = require('cors')({ origin: true })
const app = express()
app.use(cors)
app.use(cookieParser)

// Setup routes
require('./routes')(app)

// Add error handling
app.use(globalErrorHandler)

// Api
export const api = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(app)

export const updateExchangeRates = updateExchangeRatesJob

export const onUserWrite = onUserWriteTrigger
export const onUserDeletion = userDeletionTrigger
export const onBadgeSaleWrite = badgeSaleWriteTrigger
export const onBadgeSaleDeletion = badgeSaleDeletionTrigger
export const onFollowerCreate = followerCreateTrigger
