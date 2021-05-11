import { firestore } from 'firebase-admin'

export interface BadgeDocumentData {
  image: string
  imageHash: string
  lastViewed: firestore.FieldValue
  likes: number
  ownerAddress: string
  ownerId: string
  purchaseDate: firestore.FieldValue
  removedFromShowcase: boolean
  salesId: string
  shares: number
  supply: number
  title: string
  tokenId: string
  tokenType: string
  uri: string
  views: number
  meta: {
    periodViews: firestore.FieldValue
    periodStartDate: firestore.FieldValue
  }
}
