import { userAuthenticated } from '../middlewares/userAuthenticated'
import { ApiRequest } from '../types/request'
import { User } from '../types/user'
import { addToken } from '../libs/notification/addToken'
import { getAllNotifications } from '../libs/notification/getAllNotifications'
import { getNotification } from '../libs/notification/getNotification'
import { getUnreadCount } from '../libs/notification/getUnreadCount'
import { markAsRead, markAllAsRead } from '../libs/notification/markNotifcations'
import { removeToken } from '../libs/notification/removeToken'
import Router from 'express-promise-router'

const NotificationController = Router()

NotificationController.use(userAuthenticated)

NotificationController.route('/get/:id').get(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const { id } = req.params
  const notification = await getNotification({ uid, notificationId: id })
  res.status(200).send(notification)
})

NotificationController.route('/getAll').get(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const { lastdate } = req.query
  const notifications = await getAllNotifications({ uid, lastCreatedDate: lastdate })
  res.status(200).send(notifications)
})

NotificationController.route('/getUnreadCount').get(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const unreadInfo = await getUnreadCount(uid)
  res.status(200).send(unreadInfo)
})

NotificationController.route('/addToken').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const { notificationToken } = req.body
  await addToken({ uid, notificationToken })
  res.status(200).send()
})

NotificationController.route('/removeToken').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  await removeToken(uid)
  res.status(200).send()
})

NotificationController.route('/markAsRead').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  const { id } = req.body
  await markAsRead({ uid, notificationId: id })
  res.status(200).send()
})

NotificationController.route('/markAllAsRead').post(async (req: ApiRequest, res) => {
  const { uid } = req?.user as User
  await markAllAsRead(uid)
  res.status(200).send()
})

export { NotificationController }
