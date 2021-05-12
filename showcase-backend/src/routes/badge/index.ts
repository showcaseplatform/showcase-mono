import express, { Response } from 'express'
import { ApiRequest } from '../../types/request'

import { userAuthenticated } from '../../middlewares/userAuthenticated'

import { countViewHandler } from './countView'
import { countLikeHandler } from './countLike'
import { unlikeHandler } from './unLike'
import { loadUserFeedHandler } from './loadUserFeed'
import { loadOtherUserFeedHandler } from './loadOtherUserFeed'
import { unlistBadgeForSaleHandler } from './unlistBadgeForSale'
import { listBadgeForSaleHandler } from './listBadgeForSale'
import { User } from '../../types/user'
import { ROUTE_PATHS } from '../../consts/routePaths'

const BadgeRouter = express.Router()

BadgeRouter.use(userAuthenticated)

// todo: should this really be an authenticaed route?
BadgeRouter.route(ROUTE_PATHS.BADGE.COUNT_VIEW).post(async (req: ApiRequest, res: Response) => {
  const { marketplace, badgeid } = req.body
  await countViewHandler({ marketplace, badgeid })
  res.status(200).send()
})

BadgeRouter.route(ROUTE_PATHS.BADGE.COUNT_LIKE).post(async (req: ApiRequest, res: Response) => {
  const { marketplace, badgeid } = req.body
  const user = req.user as User
  await countLikeHandler({ user, marketplace, badgeid })
  res.status(200).send()
})

BadgeRouter.route(ROUTE_PATHS.BADGE.UNLIKE).post(async (req: ApiRequest, res: Response) => {
  const { marketplace, badgeid } = req.body
  const user = req.user as User
  await unlikeHandler({ marketplace, badgeid, user })
  res.status(200).send()
})

BadgeRouter.route(ROUTE_PATHS.BADGE.LIST_BADGE_FOR_SALE).post(
  async (req: ApiRequest, res: Response) => {
    const { sig, message, badgeid, currency, price } = req.body
    const user = req.user as User
    await listBadgeForSaleHandler({ sig, message, badgeid, currency, price, user })
    res.status(200).send()
  }
)

BadgeRouter.route(ROUTE_PATHS.BADGE.UNLIST_BADGE_FOR_SALE).post(
  async (req: ApiRequest, res: Response) => {
    const user = req.user as User
    const { badgeid } = req.body
    await unlistBadgeForSaleHandler({ user, badgeid })
    res.status(200).send()
  }
)

BadgeRouter.route(ROUTE_PATHS.BADGE.LOAD_USER_FEED).get(async (req: ApiRequest, res: Response) => {
  const user = req.user as User
  const lastDocumentDate = req.query.lastdate
  const { feed } = await loadUserFeedHandler({ user, lastDocumentDate })
  res.status(200).send({ feed })
})

BadgeRouter.route(ROUTE_PATHS.BADGE.LOAD_OTHER_USER_FEED).get(
  async (req: ApiRequest, res: Response) => {
    const uid = req.query.userid && req.query.userid.toString().toLowerCase() || ''
    const lastDocumentDate = req.query.lastdate
    const { feed } = await loadOtherUserFeedHandler({ uid, lastDocumentDate })
    res.status(200).send({ feed })
  }
)

export { BadgeRouter }
