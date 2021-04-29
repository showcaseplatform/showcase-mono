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
  liked: any[]
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
  uid: string
  username: string
  banned?: boolean | string
}
