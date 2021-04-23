const { userAuthenticated } = require('./../../middlewares/userAuthenticated')

const ChatRouter = require('express').Router()
const readMessageThread = require('./readMessageThread.js')
const sendMessage = require('./sendMessage.js')

ChatRouter.use(userAuthenticated)
ChatRouter.route('/readMessageThread').post(readMessageThread)
ChatRouter.route('/sendMessage').post(sendMessage)

module.exports = { ChatRouter }
