import Boom from 'boom'
import { firestore as db } from '../../services/firestore'
import { BadgeDocument, BadgeDocumentData } from '../../types/badge'
import { Uid } from '../../types/user'

interface LoadUserFeedHandlerInput {
  uid: Uid
  lastDocumentDate: string | any
}

export const loadUserFeed = async ({ uid, lastDocumentDate }: LoadUserFeedHandlerInput) => {
  if(!uid) throw Boom.badData('Invalid user')
  
  const feedQuery = db
    .collection('badges')
    .where('ownerId', '==', uid.toLowerCase())
    .where('removedFromShowcase', '==', false)

  if (lastDocumentDate) {
    feedQuery.where('createdDate', '<', new Date(lastDocumentDate))
  }

  feedQuery.orderBy('createdDate', 'desc').limit(15)

  const feedSnapshot = await feedQuery.get()
  let feed: BadgeDocument[] = []
  if (!feedSnapshot.empty) {
    feed = feedSnapshot.docs.map((doc) => {
      return { ...(doc.data() as BadgeDocumentData), id: doc.id }
    })
  }
  return { feed }
}
