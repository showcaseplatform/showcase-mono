import { userAuthenticated } from '../../middlewares/userAuthenticated'
import Router from 'express-promise-router'

const UserRouter = Router()

import updateProfile from './updateProfile.js'
import getOtherUserHandler from './loadOtherUser.js'
import { listFollowers, listFollowings } from './listFollowers'
import loadUserHandler from './loadUser.js'
import { toggleFollow } from './toggleFollow'
import { ApiRequest } from '../../types/request'
import { User } from '../../types/user'

// Public route
UserRouter.route('/avatar/:id').get(loadUserHandler)

// Protected by authentication
UserRouter.route('/updateProfile').post(userAuthenticated, updateProfile)
UserRouter.route('/toggleFollow').post(userAuthenticated, async (req: ApiRequest, res) => {
  const { uid, username } = req.user as User
  const { userid: followingUid } = req.body
  await toggleFollow({uid, username, followingUid})
  res.status(200).send()
})

UserRouter.route('/loadUser').get(userAuthenticated, loadUserHandler)
UserRouter.route('/loadOtherUser').get(userAuthenticated, getOtherUserHandler)

UserRouter.route('/listFollowing').get(userAuthenticated, async (req: ApiRequest, res) => {
    const user = req.user as User
   const { lastdate } = req.query
  const followers = await listFollowings({ user, lastdate })
  res.status(200).json(followers)
})
UserRouter.route('/listFollowers').get(userAuthenticated, async (req: ApiRequest, res) => {
    const user = req.user as User
  const { lastdate } = req.query
  const followers = await listFollowers({ user, lastdate })
  res.status(200).json(followers)
})

export { UserRouter }
