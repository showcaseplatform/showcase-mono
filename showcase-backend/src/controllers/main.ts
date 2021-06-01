import { WalletController } from './walletController'
// import { NotificationController } from './notificationController'
import { ChatController } from './chatController'
import { WithdrawalsController } from './withdrawalsController'
import { Application } from 'express'

export const MainController = (app: Application) => {
  app.use('/wallet', WalletController)
  // app.use('/notification', NotificationController)
  app.use('/chat', ChatController)
  app.use('/withdrawals', WithdrawalsController)
  app.get('/__healthy', (req, res) => {
    res.send({ status: 'ok' })
  })

  // add more routes here
}
