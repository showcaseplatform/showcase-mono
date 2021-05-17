import  { Response } from 'express'
import { ApiRequest } from '../types/request'

import { userAuthenticated } from '../middlewares/userAuthenticated'

import { User } from '../types/user'
import { ROUTE_PATHS } from '../consts/routePaths'
import Router from 'express-promise-router'
import { countLikeHandler } from '../libs/badge/countLike'
import { countViewHandler } from '../libs/badge/countView'
import { listBadgeForSaleHandler } from '../libs/badge/listBadgeForSale'
import { loadUserFeed } from '../libs/badge/loadUserFeed'
import { unlikeHandler } from '../libs/badge/unLike'
import { unlistBadgeForSaleHandler } from '../libs/badge/unlistBadgeForSale'

const BadgeController = Router()

BadgeController.use(userAuthenticated)

// todo: should this really be an authenticaed route?
BadgeController.route(ROUTE_PATHS.BADGE.COUNT_VIEW).post(async (req: ApiRequest, res: Response) => {
  const { marketplace, badgeid } = req.body
  await countViewHandler({ marketplace, badgeid })
  res.status(200).send()
})

BadgeController.route(ROUTE_PATHS.BADGE.COUNT_LIKE).post(async (req: ApiRequest, res: Response) => {
  const { marketplace, badgeid } = req.body
  const user = req.user as User
  await countLikeHandler({ user, marketplace, badgeid })
  res.status(200).send()
})

BadgeController.route(ROUTE_PATHS.BADGE.UNLIKE).post(async (req: ApiRequest, res: Response) => {
  const { marketplace, badgeid } = req.body
  const user = req.user as User
  await unlikeHandler({ marketplace, badgeid, user })
  res.status(200).send()
})

BadgeController.route(ROUTE_PATHS.BADGE.LIST_BADGE_FOR_SALE).post(
  async (req: ApiRequest, res: Response) => {
    const { sig, message, badgeid, currency, price } = req.body
    const user = req.user as User
    await listBadgeForSaleHandler({ sig, message, badgeid, currency, price, user })
    res.status(200).send()
  }
)

BadgeController.route(ROUTE_PATHS.BADGE.UNLIST_BADGE_FOR_SALE).post(
  async (req: ApiRequest, res: Response) => {
    const user = req.user as User
    const { badgeid } = req.body
    await unlistBadgeForSaleHandler({ user, badgeid })
    res.status(200).send()
  }
)

BadgeController.route(ROUTE_PATHS.BADGE.LOAD_USER_FEED).get(async (req: ApiRequest, res: Response) => {
  const { uid } = req.user as User
  const lastDocumentDate = req.query.lastdate
  const { feed } = await loadUserFeed({ uid, lastDocumentDate })
  res.status(200).send({ feed })
})

BadgeController.route(ROUTE_PATHS.BADGE.LOAD_OTHER_USER_FEED).get(
  async (req: ApiRequest, res: Response) => {
    const uid = (req.query.userid && req.query.userid.toString().toLowerCase()) || ''
    const lastDocumentDate = req.query.lastdate
    const { feed } = await loadUserFeed({ uid, lastDocumentDate })
    res.status(200).send({ feed })
  }
)

export { BadgeController }
