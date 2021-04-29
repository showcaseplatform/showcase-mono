import { Currency, Uid } from './user'

export interface IReceipt {
  saleId: string
  badgeToken: string
  transactionHash: string
  salePrice: number
  saleCurrency: Currency
  convertedPrice: number
  convertedCurrency: Currency
  convertedRate: number
  donationAmount: number
  chargeId: string
  created: Date
  user: Uid
  creator: Uid
}
