/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { firestore as db } from '../../services/firestore'
import { blockchain } from '../../config'
import { BadgeDocumentData, BadgeId, ListBadgeForSaleRequestBody } from '../../types/badge'
import { User } from '../../types/user'
import Boom from 'boom'

interface ListBadgeForSaleHandlerInput extends ListBadgeForSaleRequestBody {
  user: User
}

interface PostData {
  sig: string
  message: string
  badgeid: BadgeId
  badgeowner: string
  token: string
}

interface ValidateBadgeOwnershipInput {
  badge: BadgeDocumentData
  user: User
  price: number
  postData: PostData
  id: string
}

const validateBadgeOwnership = async ({
  badge,
  user,
  price,
  postData,
  id,
}: ValidateBadgeOwnershipInput) => {
  try {
    if (badge.ownerId === user.uid) {
      const response = await axios.post(
        blockchain.server + '/addNonFungibleToEscrowWithSignatureRelay',
        postData
      )
      if (response && response.data && response.data.success) {
        // do we make a new badge sale here? probably. then we will delete the badge from user profile on purchase
        let badgeDoc = Object.assign(badge, {
          currency: user.currency,
          price: price,
          removedFromShowcase: false,
          soldout: false,
          sold: 0,
          shares: 0,
          likes: 0,
          supply: 1,
          id,
          uri: 'https://showcase.to/badge/' + id,
          resale: true,
          resaleUser: user.uid,
          resaleUsername: user.username,
        })

        const docRef = await db.collection('badgesales').add(badgeDoc)
        // here we need to set forSale = true in the original badge doc and set saleId = the bade sale doc id
        await db
          .collection('badges')
          .doc(postData.badgeid)
          .update({ forSale: true, saleid: docRef.id })
        return { success: true }
      } else {
        throw Boom.internal('Blockchain server gave invalid response', response)
      }
    } else {
      throw Boom.preconditionFailed('User doesnt match badge owner', { badge, user })
    }
  } catch (error) {
    console.error('validateBadgeOwnership failed: ', error)
    throw error
  }
}

// todo: currency is not used, should be removed if realy not neccesary
export const listBadgeForSaleHandler = async ({
  user,
  sig,
  message,
  badgeid,
  currency,
  price,
}: ListBadgeForSaleHandlerInput) => {
  const postData: PostData = {
    sig,
    message,
    badgeid,
    badgeowner: user.crypto?.address || '',
    token: blockchain.authToken,
  }

  try {
    if (price < 0 || price > 200 || isNaN(price) || typeof price !== 'number') {
      throw Boom.badData('Invalid Price', price)
    } else {
      // todo: is it possible that this querry returns more then 1 item?
      const badgesSnapshot = await db.collection('badges').where('tokenId', '==', badgeid).get()
      if (!badgesSnapshot.empty) {
        const [badge, id] = [
          badgesSnapshot.docs[0].data() as BadgeDocumentData,
          badgesSnapshot.docs[0].id,
        ]
        await validateBadgeOwnership({ badge, id, price, postData, user })
      } else {
        throw Boom.notFound('Badge wasnt found', badgeid)
      }
    }
  } catch (error) {
    console.error('listBadgeForSaleHandler failed: ', { error })
    throw error
  }
}
