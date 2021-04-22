const { userAuthenticated } = require('./../../middlewares/userAuthenticated')
const { optionallyHasUser } = require('./../../middlewares/optionallyHasUser')

const MarketplaceRouter = require('express').Router()
const loadUserTradesHandler = require('./loadUserTrades.js')
const loadUserMarketplaceHandler = require('./loadUserMarketplace.js')
const loadOtherUserMarketplaceHandler = require('./loadOtherUserMarketplace.js')
const loadBadgesForSaleHandler = require('./loadBadgesForSale.js')
const purchaseBadgeHandler = require('./purchaseBadge.js')
const publishBadgeHandler = require('./publishBadge.js')

// Public route
MarketplaceRouter.route('/loadBadgesForSale').get(optionallyHasUser, loadBadgesForSaleHandler)

// Protected by authentication
MarketplaceRouter.route('/loadUserTrades').get(userAuthenticated, loadUserTradesHandler)
MarketplaceRouter.route('/loadUserMarketplace').get(userAuthenticated, loadUserMarketplaceHandler)
MarketplaceRouter.route('/loadOtherUserMarketplace').get(userAuthenticated, loadOtherUserMarketplaceHandler)

MarketplaceRouter.route('/purchaseBadge').post(userAuthenticated, purchaseBadgeHandler)
MarketplaceRouter.route('/publishBadge').post(userAuthenticated, publishBadgeHandler)


module.exports = MarketplaceRouter
