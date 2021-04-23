const AuthRouter = require('./auth')
const WalletRouter = require('./wallet')
const NotificationRouter = require('./notification')
const ChatRouter = require('./chat')
const CurrencyRouter = require('./currency')
const BadgeRouter = require('./badge')
const CausesRouter = require('./causes')
const WithdrawalsRouter = require('./withdrawals')
const MarketplaceRouter = require('./marketplace')

module.exports = (app) => {
  app.use('/auth', AuthRouter)
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
