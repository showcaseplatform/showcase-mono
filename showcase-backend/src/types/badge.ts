import { firestore } from 'firebase-admin';
import { Currency } from './user';

export type BadgeId = string

export interface CountViewRequestBody {
  marketplace: boolean
  badgeid: BadgeId
}

export interface CountLikeRequestBody extends CountViewRequestBody {}
export interface UnlikeRequestBody extends CountViewRequestBody {}

export interface ListBadgeForSaleRequestBody {
  sig: string
  message: string
  badgeid: BadgeId
  currency: string
  price: number
}

export interface UnlistBadgeForSaleRequestBody {
  badgeid: BadgeId
}

export interface LoadUserFeedHandlerRequestParam {
  lastdate: string | undefined
}

export interface BadgeDocumentData  {
  category: string

  createdDate: Date
  creatorAddress: string
  creatorId: string
  creatorName: string

  description: string

  donationAmount?: number
  donationCause?: string

  edition: number
  image: string
  imageHash: string
  lastViewed: Date
  likes: number

  ownerAddress: string
  ownerId: string
  purchaseDate: Date

  removedFromShowcase: boolean

  saleId: string
  shares: number
  title: string
  tokenId: BadgeId // todo: id which links a badge to a token
  tokenType: string // todo: id of the nft contract?
  uri: string
  views: number
  // meta: {
  //   periodViews: firestore.FieldValue
  //   periodStartDate: firestore.FieldValue
  // }
}

export interface BadgeDocument extends BadgeDocumentData{
 id: BadgeId
}


export interface SalesBadge extends BadgeDocumentData {
  id: string
  sold: number
  supply: number
  tokenType: string
  currency: Currency
  price: number

  donationCauseImage?: string
  donationCauseName?: string
  donationAmount?: number
  donationCause?: string
}
