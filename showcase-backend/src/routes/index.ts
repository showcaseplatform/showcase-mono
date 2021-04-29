import { AuthRouter } from './auth'
import { WalletRouter } from './wallet'
import { NotificationRouter } from './notification'
import { ChatRouter } from './chat'
import { CurrencyRouter } from './currency'
import { BadgeRouter } from './badge'
import { CausesRouter } from './causes'
import { WithdrawalsRouter } from './withdrawals'
import { MarketplaceRouter } from './marketplace'
import { Application } from 'express'
import { UserRouter } from './user'

export const MainRouter = (app: Application) => {
  app.use('/auth', AuthRouter)
  app.use('/user', UserRouter)
  app.use('/wallet', WalletRouter)
  app.use('/notification', NotificationRouter)
  app.use('/chat', ChatRouter)
  app.use('/currency', CurrencyRouter)
  app.use('/badge', BadgeRouter)
  app.use('/causes', CausesRouter)
  app.use('/withdrawals', WithdrawalsRouter)
  app.use('/marketplace', MarketplaceRouter)

  // add more routes here
}
