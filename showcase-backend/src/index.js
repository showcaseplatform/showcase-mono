// import services
const { functions } = require('./services/firestore')

// Import triggers
const { badgeSaleWriteTrigger } = require('./triggers/badgeSaleWrite')
const { userDeletionTrigger } = require('./triggers/userDeletion')
const { onUserWriteTrigger } = require('./triggers/userWrite')
const { badgeSaleDeletionTrigger } = require('./triggers/badgeSaleIndexDeletion')
const { followerCreateTrigger } = require('./triggers/followerCreate')

// Import jobs
const { updateExchangeRatesJob } = require('./jobs/updateExchangeRates')

// Import middlewares
const { globalErrorHandler } = require('./middlewares/globalErrorHandler')

// Set up api server
const express = require('express')
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
exports.app = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(app)

// Jobs
exports.updateExchangeRates = updateExchangeRatesJob

// Triggers
exports.onUserWrite = onUserWriteTrigger
exports.onUserDeletion = userDeletionTrigger
exports.onBadgeSaleWrite = badgeSaleWriteTrigger
exports.onBadgeSaleDeletion = badgeSaleDeletionTrigger
exports.onFollowerCreate = followerCreateTrigger
