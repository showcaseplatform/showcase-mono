import express from 'express'
import { readMessageThread } from '../libs/chat/readMessageThread'
import { sendMessage } from '../libs/chat/sendMessage'

const ChatController = express.Router()

ChatController.route('/readMessageThread').post(readMessageThread)
ChatController.route('/sendMessage').post(sendMessage)

export { ChatController }
