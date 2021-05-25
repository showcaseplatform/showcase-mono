import  { Response } from 'express'
import { ApiRequest } from '../types/request'

import { userAuthenticated } from '../middlewares/userAuthenticated'

import { User } from '../types/user'
import { ROUTE_PATHS } from '../consts/routePaths'
import Router from 'express-promise-router'
import { listBadgeForSaleHandler } from '../libs/badge/listBadgeForSale'
import { unlistBadgeForSaleHandler } from '../libs/badge/unlistBadgeForSale'

const BadgeController = Router()

BadgeController.use(userAuthenticated)


// BadgeController.route(ROUTE_PATHS.BADGE.COUNT_LIKE).post(async (req: ApiRequest, res: Response) => {
//   const { marketplace, badgeid } = req.body
//   const user = req.user as User
//   await likeBadge({ user, marketplace, badgeid })
//   res.status(200).send()
// })

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

export { BadgeController }
