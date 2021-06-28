import { Currency } from '../generated/graphql'

export const currencies = [
  {
    value: Currency.Usd,
    label: Currency.Usd,
  },
  {
    value: Currency.Eur,
    label: Currency.Eur,
  },
  {
    value: Currency.Gbp,
    label: Currency.Gbp,
  },
]

export const currencySymbols: { [key in Currency]: string } = {
  EUR: '€',
  GBP: '£',
  USD: '$',
}
