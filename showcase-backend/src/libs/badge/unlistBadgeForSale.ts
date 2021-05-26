/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { blockchain } from '../../config'
import { Uid } from '../../types/user'
import Boom from 'boom'
import { UnListBadgeForSaleInput } from '../../resolvers/types/unlistBadgeForSaleInput'
import prisma from '../../services/prisma'

export const unlistBadgeForSale = async (input: UnListBadgeForSaleInput, uid: Uid) => {
  const { badgeId } = input

  const badge = await prisma.badge.findUnique({
    where: {
      id: badgeId
    }
  })
  
  // here we need to make sure user currently owns the badge because the removebadge is called from escrow
  if (!badge || badge.ownerProfileId != uid) {
    throw Boom.preconditionFailed('User doesnt match badge owner', { badge, uid })
  }
  const response = await axios.post(blockchain.server + '/removeBadgeFromEscrow', { badgeid: badgeId })

  if (response && response.data && response.data.success) {
    // todo: delete related the badgeSale for this listing, if concept stays to create new badgeType when resale
    return await prisma.badge.update({
      where: {
        id: badgeId
      },
      data: {
        forSale: false
      }
    })
  } else {
    throw Boom.internal('Blockchain server gave invalid response', response)
  }
}
