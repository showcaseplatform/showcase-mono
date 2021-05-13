import { userAuthenticated } from '../../middlewares/userAuthenticated'
import { optionallyHasUser } from '../../middlewares/optionallyHasUser'
import Router from 'express-promise-router'
import loadUserTradesHandler from './loadUserTrades.js'
import loadUserMarketplaceHandler from './loadUserMarketplace.js'
import loadOtherUserMarketplaceHandler from './loadOtherUserMarketplace.js'
import loadBadgesForSaleHandler from './loadBadgesForSale.js'
import purchaseBadgeHandler from './purchaseBadge.js'
import publishBadgeHandler from './publishBadge.js'

const MarketplaceRouter = Router()
// Public route
MarketplaceRouter.route('/loadBadgesForSale').get(optionallyHasUser, loadBadgesForSaleHandler)

// Protected by authentication
MarketplaceRouter.route('/loadUserTrades').get(userAuthenticated, loadUserTradesHandler)
MarketplaceRouter.route('/loadUserMarketplace').get(userAuthenticated, loadUserMarketplaceHandler)
MarketplaceRouter.route('/loadOtherUserMarketplace').get(
  userAuthenticated,
  loadOtherUserMarketplaceHandler
)

MarketplaceRouter.route('/purchaseBadge').post(userAuthenticated, purchaseBadgeHandler)
MarketplaceRouter.route('/publishBadge').post(userAuthenticated, publishBadgeHandler)

export { MarketplaceRouter }
