import { userAuthenticated } from '../../middlewares/userAuthenticated'
import express from 'express'

const UserRouter = express.Router()

import updateProfile from './updateProfile.js'
import getOtherUserHandler from './loadOtherUser.js'
import listFollowingHandler from './listFollowing.js'
import listFollowersHandler from './listFollowers.js'
import loadUserHandler from './loadUser.js'
import { addFriend } from './addFriend'

// Public route
UserRouter.route('/avatar/:id').get(loadUserHandler)

// Protected by authentication
UserRouter.route('/updateProfile').post(userAuthenticated, updateProfile)
UserRouter.route('/removeFriend').post(userAuthenticated, getOtherUserHandler)
UserRouter.route('/addFriend').post(userAuthenticated, addFriend)

UserRouter.route('/loadUser').get(userAuthenticated, loadUserHandler)
UserRouter.route('/loadOtherUser').get(userAuthenticated, getOtherUserHandler)
UserRouter.route('/listFollowing').get(userAuthenticated, listFollowingHandler)
UserRouter.route('/listFollowers').get(userAuthenticated, listFollowersHandler)

export { UserRouter }
