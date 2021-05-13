import { BadgeId } from './badge'
import { Chat } from './chat'

export type Currency = 'USD' | 'GBP' | 'USD'

export type Uid = string

export type NotificationToken = string

export interface Follower {
  uid: Uid,
  createdDate: Date
}
export interface User {
  areaCode: number
  avatar: string
  badgesCount: number
  balances: {
    eur: number
    gbp: number
    usd: number
  }
  birthDate: Date
  birthDay: number
  birthMonth: number
  birthYear: number
  chats: Chat[]
  currency: Currency
  displayName: string
  followersCount: number
  followingCount: number
  liked: Record<BadgeId, boolean>
  notificationToken?: NotificationToken
  phoneLocal: string
  phoneNumber: string
  recentWithdrawalAmount: number
  recentWithdrawalDate: Date
  spent: number
  spripeId: string
  transferwiseAccountNumberEUR: string
  transferwiseAccountNumberGBP: string
  transferwiseAccountNumberUSD: string
  transferwiseIdEUR: number
  transferwiseIdGBP: number
  transferwiseIdUSD: number
  uid: Uid
  username: string
  banned?: boolean | string
  crypto?: Crypto
  creator?: boolean
  bio?: string
}


export interface Crypto {
  address: string
}

export interface Profile {
  uid: Uid,
  bio?: string,
  creator?:boolean,
  displayName: string,
  username: string,
  avatar?: string,
}

export interface ListFollowersResponse {
  profiles: Profile[]
  lastdate: any
}