import { Currency } from '../generated/graphql'

export const currencies = [
  {
    value: Currency.USD,
    label: Currency.USD,
  },
  {
    value: Currency.Eur,
    label: Currency.Eur,
  },
  {
    value: Currency.GBP,
    label: Currency.GBP,
  },
]

export const currencySymbols: { [key in Currency]: string } = {
  EUR: '€',
  GBP: '£',
  USD: '$',
}
