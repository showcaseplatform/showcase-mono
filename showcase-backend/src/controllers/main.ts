import { WalletController } from './walletController'
import { ChatController } from './chatController'
import { Application } from 'express'

export const MainController = (app: Application) => {
  app.use('/wallet', WalletController)
  app.use('/chat', ChatController)
  app.get('/__healthy', (req, res) => {
    res.send({ status: 'ok' })
  })

  // add more routes here
}
