import { userAuthenticated } from '../middlewares/userAuthenticated'
import { optionallyHasUser } from '../middlewares/optionallyHasUser'
import loadUserTradesHandler from '../libs/marketplace/loadUserTrades'
import loadUserMarketplaceHandler from '../libs/marketplace/loadUserMarketplace'
import loadOtherUserMarketplaceHandler from '../libs/marketplace/loadOtherUserMarketplace'
import loadBadgesForSaleHandler from '../libs/marketplace/loadBadgesForSale'
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

export { MarketplaceController }
