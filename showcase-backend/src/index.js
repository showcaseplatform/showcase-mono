const functions = require('firebase-functions')
const { firestore: db } = require('./services/firestore')

const axios = require('axios')
const { client: algoliaClient } = require('./services/algolia')

const { onBadgeSaleWriteHandler } = require('./handlers/badgeSaleWrite')
const { onUserIndexDeletionHandler } = require('./handlers/userIndexDeletion')
const { onUserWriteHandler } = require('./handlers/userWrite')
const { badgeSaleIndexDeletionHandler } = require('./handlers/badgeSaleIndexDeletion')
const { scheduledFunctionHandler } = require('./handlers/scheduledFunction')

const { globalErrorHandler } = require('./middlewares/globalErrorHandler')

const express = require('express')
const cookieParser = require('cookie-parser')()
const cors = require('cors')({ origin: true })
const app = express()
app.use(cors)
app.use(cookieParser)

// setup routes
require('./routes')(app)

// add error handling
app.use(globalErrorHandler)

exports.app = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(app)

exports.scheduledFunction = functions.pubsub.schedule('30 16 * * *').onRun((context) => {
  return scheduledFunctionHandler(axios, db, context)
})

exports.onUserWrite = functions.firestore.document('users/{uid}').onWrite((data, context) => {
  return onUserWriteHandler(algoliaClient, data, context)
})

exports.userIndexDeletion = functions.firestore
  .document(`users/{uid}`)
  .onDelete((snap, context) => {
    return onUserIndexDeletionHandler(algoliaClient, snap, context)
  })

exports.onBadgeSaleWrite = functions.firestore
  .document('badgesales/{badgeId}')
  .onWrite((data, context) => {
    return onBadgeSaleWriteHandler(algoliaClient, data, context)
  })

exports.badgeSaleIndexDeletion = functions.firestore
  .document(`badgesales/{badgeId}`)
  .onDelete((snap, context) => {
    return badgeSaleIndexDeletionHandler(algoliaClient, snap, context)
  })
