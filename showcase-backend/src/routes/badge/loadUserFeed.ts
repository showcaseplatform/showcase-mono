import Boom from 'boom'
import { firestore as db } from '../../services/firestore'
import { BadgeDocument, BadgeDocumentData } from '../../types/badge'
import { User } from '../../types/user'

interface LoadUserFeedHandlerInput {
  user: User
  lastDocumentDate: string | any
}

export const loadUserFeedHandler = async ({ user, lastDocumentDate }: LoadUserFeedHandlerInput) => {
  try {
    const feedQuery = db
      .collection('badges')
      .where('ownerId', '==', user.uid.toLowerCase())
      .where('removedFromShowcase', '==', false)

    if (lastDocumentDate) {
      feedQuery.where('createdDate', '<', new Date(lastDocumentDate))
    }

    feedQuery.orderBy('createdDate', 'desc').limit(15)

    const feedSnapshot = await feedQuery.get()
    if (feedSnapshot.empty) {
      throw Boom.notFound('Empty feed', { user, lastDocumentDate })
    }

    const feed: BadgeDocument[] = feedSnapshot.docs.map((doc) => {
      return { ...(doc.data() as BadgeDocumentData), id: doc.id }
    })

    return { feed }
  } catch (error) {
    console.error('loadUserFeedHandler failed: ', error)
    throw error
  }
}
