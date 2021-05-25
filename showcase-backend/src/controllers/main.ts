import { AuthController } from './authController'
import { WalletController } from './walletController'
import { NotificationController } from './notificationController'
import { ChatController } from './chatController'
import { CurrencyController } from './currencyController'
import { BadgeController } from './badgeController'
import { CausesController } from './causesController'
import { WithdrawalsController } from './withdrawalsController'
import { Application } from 'express'
import { UserController } from './userController'
import { TestController } from './testController'
import { ROUTE_PATHS } from '../consts/routePaths'

export const MainController = (app: Application) => {
  app.use(ROUTE_PATHS.AUTH.MAIN, AuthController)
  app.use('/user', UserController)
  app.use('/wallet', WalletController)
  app.use('/notification', NotificationController)
  app.use('/chat', ChatController)
  app.use('/currency', CurrencyController)
  app.use('/badge', BadgeController)
  app.use('/causes', CausesController)
  app.use('/withdrawals', WithdrawalsController)
  app.use('/test', TestController)
  app.get('/__healthy', (req, res) => {
    res.send({ status: 'ok' })
  })

  // add more routes here
}
