import { userAuthenticated } from '../middlewares/userAuthenticated'
import express from 'express'
import { readMessageThread } from '../libs/chat/readMessageThread'
import { sendMessage } from '../libs/chat/sendMessage'

const ChatController = express.Router()


ChatController.use(userAuthenticated)
ChatController.route('/readMessageThread').post(readMessageThread)
ChatController.route('/sendMessage').post(sendMessage)

export { ChatController }
