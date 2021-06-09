/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { blockchain } from '../../config'
import { Uid } from '../../types/user'
import Boom from 'boom'
import { UnListBadgeForSaleInput } from './types/unlistBadgeForSale.type'
import prisma from '../../services/prisma'

export const unlistBadgeForSale = async (input: UnListBadgeForSaleInput, uid: Uid) => {
  const { badgeItemId } = input

  const badge = await prisma.badgeItem.findUnique({
    where: {
      id: badgeItemId,
    },
  })

  // here we need to make sure user currently owns the badge because the removebadge is called from escrow
  if (!badge || badge.ownerId != uid) {
    throw Boom.preconditionFailed('User doesnt match badge owner', { badge, uid })
  }

  // todo: remove blockchain.enabled once server is ready
  const response = blockchain.enabled
    ? await axios.post(blockchain.server + '/removeBadgeFromEscrow', { badgeid: badgeItemId })
    : { data: { success: true } }

  if (response && response.data && response.data.success) {
    // todo: delete related the badgeSale for this listing, if concept stays to create new badgeType when resale
    return await prisma.badgeItem.update({
      where: {
        id: badgeItemId,
      },
      data: {
        forSale: false,
      },
    })
  } else {
    throw Boom.internal('Blockchain server gave invalid response', response)
  }
}
