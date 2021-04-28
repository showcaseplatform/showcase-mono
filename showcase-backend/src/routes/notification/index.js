const { userAuthenticated } = require('./../../middlewares/userAuthenticated')

const NotificationRouter = require('express').Router()
const addToken = require('./addToken.js')
const removeToken = require('./removeToken.js')

NotificationRouter.use(userAuthenticated)
NotificationRouter.route('/addToken').post(addToken)
NotificationRouter.route('/removeToken').post(removeToken)

module.exports = { NotificationRouter }
