const { userAuthenticated } = require('./../../middlewares/userAuthenticated')

const UserRouter = require('express').Router()
const updateProfile = require('./updateProfile.js')
const getOtherUserHandler = require('./loadOtherUser.js')
const addFriendHandler = require('./addFriend.js')
const listFollowingHandler = require('./listFollowing.js')
const listFollowersHandler = require('./listFollowers.js')
const loadUserHandler = require('./loadUser.js')

// Public route
UserRouter.route('/avatar/:id').get(loadUserHandler)

// Protected by authentication
UserRouter.route('/updateProfile').post(userAuthenticated, updateProfile)
UserRouter.route('/removeFriend').post(userAuthenticated, getOtherUserHandler)
UserRouter.route('/addFriend').post(addFriendHandler)

UserRouter.route('/loadUser').get(userAuthenticated, loadUserHandler)
UserRouter.route('/loadOtherUser').get(userAuthenticated, getOtherUserHandler)
UserRouter.route('/listFollowing').get(userAuthenticated, listFollowingHandler)
UserRouter.route('/listFollowers').get(userAuthenticated, listFollowersHandler)

module.exports = UserRouter