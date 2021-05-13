import { userAuthenticated } from '../middlewares/userAuthenticated'
import { ApiRequest } from '../types/request'
import { UpdateProfileRequest, User } from '../types/user'
import { listFollowings, listFollowers } from '../libs/user/listFollowers'
import { loadUser, loadOtherUser } from '../libs/user/loadUser'
import { toggleFollow } from '../libs/user/toggleFollow'
import { updateProfile } from '../libs/user/updateProfile'
import { getUserAvatar } from '../libs/user/avatar'
import Router from 'express-promise-router'

const UserController = Router()

// Public route
UserController.route('/avatar/:id').get(async (req: ApiRequest, res) => {
  const uid = req.params.id
  const avatar = await getUserAvatar(uid)
  res.redirect(301, avatar)
})

// Protected by authentication
UserController.route('/updateProfile').post(userAuthenticated, async (req: ApiRequest, res) => {
  const user = req.user as User
  const body = req.body as UpdateProfileRequest
  const updatedUser = await updateProfile({ ...body, user })
  res.status(200).send({ user: updatedUser })
})

UserController.route('/toggleFollow').post(userAuthenticated, async (req: ApiRequest, res) => {
  const { uid, username } = req.user as User
  const { userid: followingUid } = req.body
  await toggleFollow({ uid, username, followingUid })
  res.status(200).send()
})

UserController.route('/loadUser').get(userAuthenticated, loadUser)
UserController.route('/loadOtherUser').get(userAuthenticated, loadOtherUser)

UserController.route('/listFollowing').get(userAuthenticated, async (req: ApiRequest, res) => {
  const user = req.user as User
  const { lastdate } = req.query
  const followers = await listFollowings({ user, lastdate })
  res.status(200).json(followers)
})
UserController.route('/listFollowers').get(userAuthenticated, async (req: ApiRequest, res) => {
  const user = req.user as User
  const { lastdate } = req.query
  const followers = await listFollowers({ user, lastdate })
  res.status(200).json(followers)
})

export { UserController }
