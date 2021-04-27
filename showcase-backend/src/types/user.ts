export interface IChat {
  id: {
    archived: boolean
    chatId: string
    lastMessage: string
    lastMessageDate: Date
    unreadMessageCount: number
    username: string
  }
}

export type Currency = 'USD' | 'GBP' | 'USD'

export type Uid = string

export interface IUser {
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
  chats: IChat[]
  currency: Currency
  displayName: string
  followersCount: number
  followingCount: number
  liked: any[]
  notificationToken?: string
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
}
