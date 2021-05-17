import { userAuthenticated } from '../middlewares/userAuthenticated'
import { optionallyHasUser } from '../middlewares/optionallyHasUser'
import loadUserTradesHandler from '../libs/marketplace/loadUserTrades'
import loadUserMarketplaceHandler from '../libs/marketplace/loadUserMarketplace'
import loadOtherUserMarketplaceHandler from '../libs/marketplace/loadOtherUserMarketplace'
import loadBadgesForSaleHandler from '../libs/marketplace/loadBadgesForSale'
import purchaseBadgeHandler from '../libs/marketplace/purchaseBadge'
import publishBadgeHandler from '../libs/marketplace/publishBadge'
import Router from 'express-promise-router'

const MarketplaceController = Router()
// Public route
MarketplaceController.route('/loadBadgesForSale').get(optionallyHasUser, loadBadgesForSaleHandler)

// Protected by authentication
MarketplaceController.route('/loadUserTrades').get(userAuthenticated, loadUserTradesHandler)
MarketplaceController.route('/loadUserMarketplace').get(
  userAuthenticated,
  loadUserMarketplaceHandler
)
MarketplaceController.route('/loadOtherUserMarketplace').get(
  userAuthenticated,
  loadOtherUserMarketplaceHandler
)

MarketplaceController.route('/purchaseBadge').post(userAuthenticated, purchaseBadgeHandler)
MarketplaceController.route('/publishBadge').post(userAuthenticated, publishBadgeHandler)

export { MarketplaceController }
