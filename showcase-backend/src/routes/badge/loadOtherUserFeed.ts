import Boom from 'boom'
import { firestore as db } from '../../services/firestore'
import { BadgeDocument, BadgeDocumentData } from '../../types/badge'
import { Uid } from '../../types/user'

interface LoadOtherUserFeedHandlerInput {
  uid: Uid
  lastDocumentDate: string | any
}

export const loadOtherUserFeedHandler = async ({
  uid,
  lastDocumentDate,
}: LoadOtherUserFeedHandlerInput) => {
  try {
    if (uid) {
      throw Boom.notAcceptable('Invalid user', uid)
    }
    const feedQuery = db
      .collection('badges')
      .where('ownerId', '==', uid)
      .where('removedFromShowcase', '==', false)

    if (lastDocumentDate) {
      feedQuery.where('createdDate', '<', new Date(lastDocumentDate))
    }

    feedQuery.orderBy('createdDate', 'desc').limit(15)

    const feedSnapshot = await feedQuery.get()
    if (feedSnapshot.empty) {
      throw Boom.notFound('Empty feed', { uid, lastDocumentDate })
    }

    const feed: BadgeDocument[] = feedSnapshot.docs.map((doc) => {
      return { ...(doc.data() as BadgeDocumentData), id: doc.id }
    })

    return { feed }
  } catch (error) {
    console.error('loadOtherUserFeedHandler failed: ', error)
    throw error
  }
}
