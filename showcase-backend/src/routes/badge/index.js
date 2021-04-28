const { userAuthenticated } = require('../../middlewares/userAuthenticated')

const BadgeRouter = require('express').Router()
const countViewHandler = require('./countView.js')
const countLikeHandler = require('./countLike.js')
const unLikeHandler = require('./unLike.js')
const loadUserFeedHandler = require('./loadUserFeed.js')
const loadOtherUserFeedHandler = require('./loadOtherUserFeed.js')
const unlistBadgeForSaleHandler = require('./unlistBadgeForSale.js')
const listBadgeForSaleHandler = require('./listBadgeForSale.js')

BadgeRouter.use(userAuthenticated)

BadgeRouter.route('/countView').post(countViewHandler)
BadgeRouter.route('/countLike').post(countLikeHandler)
BadgeRouter.route('/unLike').post(unLikeHandler)
BadgeRouter.route('/unlistBadgeForSale').post(unlistBadgeForSaleHandler)
BadgeRouter.route('/listBadgeForSale').post(listBadgeForSaleHandler)

BadgeRouter.route('/loadUserFeed').get(loadUserFeedHandler)
BadgeRouter.route('/loadOtherUserFeed').get(loadOtherUserFeedHandler)

module.exports = { BadgeRouter }
