import express from 'express'
import { userAuthenticated } from '../../middlewares/userAuthenticated'
import { addToken } from './addToken'
import { removeToken } from './removeToken'
import { markAsRead, markAllAsRead } from './markNotifcations'
import { getNotification } from './getNotification'
import { getAllNotifications } from './getAllNotifications'
import { ApiRequest } from '../../types/request'
import { User } from '../../types/user'
import { getUnreadCount } from './getUnreadCount'

const NotificationRouter = express.Router()

NotificationRouter.use(userAuthenticated)

NotificationRouter.route('/get/:id').get(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const { id } = req.params
  const notification = await getNotification({ uid, notificationId: id })
  res.status(200).send(notification)
})

NotificationRouter.route('/getAll').get(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const notifications = await getAllNotifications(uid)
  res.status(200).send(notifications)
})

NotificationRouter.route('/getUnreadCount').get(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const unreadInfo = await getUnreadCount(uid)
  res.status(200).send(unreadInfo)
})

NotificationRouter.route('/addToken').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const { notificationToken } = req.body
  await addToken({ uid, notificationToken })
  res.status(200).send()
})

NotificationRouter.route('/removeToken').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  await removeToken(uid)
  res.status(200).send()
})

NotificationRouter.route('/markAsRead').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const { id } = req.body
  await markAsRead({ uid, notificationId: id })
  res.status(200).send()
})

NotificationRouter.route('/markAllAsRead').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  await markAllAsRead(uid)
  res.status(200).send()
})

export { NotificationRouter }
