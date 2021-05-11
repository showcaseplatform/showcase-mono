import { userAuthenticated } from '../../middlewares/userAuthenticated'
import express from 'express'

const ChatRouter = express.Router()

import { readMessageThread } from './readMessageThread'
import { sendMessage } from './sendMessage'

ChatRouter.use(userAuthenticated)
ChatRouter.route('/readMessageThread').post(readMessageThread)
ChatRouter.route('/sendMessage').post(sendMessage)

export { ChatRouter }
