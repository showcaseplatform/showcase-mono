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
  phoneLocal: string
  phoneNumber: string

  birthDate?: Date
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  chats?: Chat[]
  liked?: any[]
  notificationToken?: NotificationToken
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
  creator?: boolean
}
