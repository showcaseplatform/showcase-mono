import { BadgeId } from './badge'
import { Chat } from './chat'

export type Currency = 'USD' | 'GBP' | 'EUR'

export type Uid = string

export type NotificationToken = string

export interface Follower {
  uid: Uid,
  createdDate: Date
}
export interface User {
  areaCode: number
  avatar?: string
  badgesCount: number
  balances: {
    eur: number
    gbp: number
    usd: number
  }
  uid: Uid
  username: string
  currency: Currency
  displayName: string
  followersCount: number
  followingCount: number
  liked: Record<BadgeId, boolean>
  notificationToken?: NotificationToken
  phoneLocal: string
  phoneNumber: string

  birthDate?: Date
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  chats?: Chat[]
  recentWithdrawalAmount?: number
  recentWithdrawalDate?: Date
  spent?: number
  spripeId?: string
  transferwiseAccountNumberEUR?: string
  transferwiseAccountNumberGBP?: string
  transferwiseAccountNumberUSD?: string
  transferwiseIdEUR?: number
  transferwiseIdGBP?: number
  transferwiseIdUSD?: number
  banned?: boolean | string
  crypto?: Crypto
  creator?: boolean
  bio?: string
  email? : string
}


export interface Crypto {
  address: string
}

export interface PublicProfile {
  uid: Uid,
  bio?: string,
  creator?:boolean,
  displayName: string,
  username: string,
  avatar?: string,
}
export interface UpdateProfileRequest {
  bio?: string,
  displayName?: string,
  username?: string,
  avatar?: string,
  email?: string,
  birthDate?: string | Date
  currency: Currency
}

export interface ListFollowersResponse {
  profiles: PublicProfile[]
  lastdate: any
}