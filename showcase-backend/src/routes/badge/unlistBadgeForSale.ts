/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { firestore as db } from '../../services/firestore'
import { blockchain } from '../../config'
import { BadgeDocumentData, UnlistBadgeForSaleRequestBody } from '../../types/badge'
import { User } from '../../types/user'
import Boom from 'boom'

interface UnlistBadgeForSaleHandler extends UnlistBadgeForSaleRequestBody {
  user: User
}

export const unlistBadgeForSaleHandler = async ({ user, badgeid }: UnlistBadgeForSaleHandler) => {
  // here we need to make sure user currently owns the badge because the removebadge is called from escrow
  try {
    const snapshot = await db.collection('badges').where('tokenId', '==', badgeid).get()
    if (snapshot.empty) {
      throw Boom.notFound('Badge wasnt found', badgeid)
    }
    const badge = snapshot.docs[0].data() as BadgeDocumentData
    if (badge.ownerId !== user.uid) {
      throw Boom.preconditionFailed('User doesnt match badge owner', { badgeRecord: badge, user })
    }
    const response = await axios.post(blockchain.server + '/removeBadgeFromEscrow', { badgeid })
    if (response && response.data && response.data.success) {
      // now we need to delete the badge sale for this listing
      const snapshot = await db.collection('badges').where('tokenId', '==', badgeid).get()
      const { id } = snapshot.docs[0]
      await db.collection('badges').doc(id).delete()
      return { success: true }
    } else {
      throw Boom.internal('Blockchain server gave invalid response', response)
    }
  } catch (error) {
    console.error('unlistBadgeForSaleHandler failed: ', { error })
    throw error
  }
}
