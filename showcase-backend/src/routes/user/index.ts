import { userAuthenticated } from '../../middlewares/userAuthenticated'
import Router from 'express-promise-router'

const UserRouter = Router()

import updateProfile from './updateProfile.js'
import getOtherUserHandler from './loadOtherUser.js'
import listFollowingHandler from './listFollowing.js'
import { listFollowers } from './listFollowers'
import loadUserHandler from './loadUser.js'
import { addFriend } from './addFriend'
import { ApiRequest } from '../../types/request'
import { ListFollowersResponse } from '../../types/user'

// Public route
UserRouter.route('/avatar/:id').get(loadUserHandler)

// Protected by authentication
UserRouter.route('/updateProfile').post(userAuthenticated, updateProfile)
UserRouter.route('/removeFriend').post(userAuthenticated, getOtherUserHandler)
UserRouter.route('/addFriend').post(userAuthenticated, addFriend)

UserRouter.route('/loadUser').get(userAuthenticated, loadUserHandler)
UserRouter.route('/loadOtherUser').get(userAuthenticated, getOtherUserHandler)
UserRouter.route('/listFollowing').get(userAuthenticated, listFollowingHandler)
UserRouter.route('/listFollowers').get(userAuthenticated, async (req: ApiRequest, res): Promise<ListFollowersResponse> => {
  const { user } = req
  const { lastdate } = req.query
  const followers = await listFollowers({user, lastdate})
  res.status(200).json(followers)
})

export { UserRouter }
