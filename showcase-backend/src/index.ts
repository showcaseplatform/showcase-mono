// Import packages
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Import services
import { functions } from './services/firestore'

// Import triggers
import { badgeSaleWriteTrigger } from './triggers/badgeSaleWrite'
import { userDeletionTrigger } from './triggers/userDeletion'
import { onUserWriteTrigger } from './triggers/userWrite'
import { badgeSaleDeletionTrigger } from './triggers/badgeSaleIndexDeletion'

// Import jobs
import { updateExchangeRatesJob } from './jobs/updateExchangeRates'

// Import middlewares
import { globalErrorHandler } from './middlewares/globalErrorHandler'

// Import routing
import { MainRouter } from './routes'
import { periodEndJob } from './jobs/periodEnd'
import { checkExpoReceiptsJob } from './jobs/checkNotificationReceipts'

// Set up api server
const app = express()
app.use(cors({ origin: true }))
app.use(cookieParser())

// Setup routes
MainRouter(app)

// Add error handling
app.use(globalErrorHandler)

// Api
export const api = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(app)

// Jobs
export const updateExchangeRates = updateExchangeRatesJob
export const checkExpoReceipts = checkExpoReceiptsJob 

// Triggers
export const onUserWrite = onUserWriteTrigger
export const onUserDeletion = userDeletionTrigger
export const onBadgeSaleWrite = badgeSaleWriteTrigger
export const onBadgeSaleDeletion = badgeSaleDeletionTrigger
