import { Ionicons } from '@expo/vector-icons'
import { isThisMonth, isThisWeek, isThisYear, isToday } from 'date-fns'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

import { ImageURISource } from 'react-native'
import { MyBadgeCategory } from '../../types'
import { MyBadgeType } from '../features/badges/components/BadgeItem.component'
import { Category, Currency } from '../generated/graphql'
import { currencySymbols } from './currencies'

export type IonIconName = React.ComponentProps<typeof Ionicons>['name']

type BadgeHistoryDataItem = {
  title: string
  data: MyBadgeType[]
}

export function isEven(number: number) {
  return number % 2 === 0
}

const today = new Date()

export function callIfFn<R>(
  value: R
): R extends () => unknown ? ReturnType<R> : R {
  return typeof value === 'function' ? value() : value
}

// flatlist does not support multi row/column horizontals. With the reshaped array mimicing 2 rows horizontal flatlaist
export const reshapeBadges: <T>(arr: T[], shapeLength?: number) => T[][] = (
  arr,
  shapeLength = 2
) => {
  const copyArr = [...arr]
  const newArr = []
  while (copyArr.length) {
    newArr.push(copyArr.splice(0, shapeLength))
  }
  return newArr
}

export const delay = (t: number) =>
  new Promise((resolve) => setTimeout(resolve, t))

export function makePriceTag(price: number, currency: Currency) {
  if (typeof price !== 'number' || !currency) {
    return 'unknown'
  }

  return `${price.toString()} ${currencySymbols[currency]}`
}

export function makeSupplyTag(sold: number, supply: number) {
  return `${supply - sold}/${supply}`
}

export function makeDonationTag(amount?: number) {
  if (typeof amount !== 'number') {
    return ''
  }

  return `${amount * 100}%`
}

export const makePercent = (number?: number) => {
  if (typeof number === 'number') {
    return number * 100
  } else {
    return 0
  }
}

export function makeDateDistanceTag(date: Date | number) {
  let myDate = date
  if (typeof date === 'number') {
    myDate = new Date(date)
  }
  return formatDistanceStrict(myDate, today, { addSuffix: true })
}

export function groupBadgesByDateDistance(badges: MyBadgeType[]) {
  const groupedBadges: BadgeHistoryDataItem[] = [
    {
      title: 'Today',
      data: [],
    },
    {
      title: 'This Week',
      data: [],
    },
    {
      title: 'This Month',
      data: [],
    },
    {
      title: 'This Year',
      data: [],
    },
    {
      title: 'Earlier',
      data: [],
    },
  ]

  badges.reduce((result, currBadge) => {
    const { _seconds: seconds } = currBadge.createdAt
    const currentDateInMs = seconds * 1000

    if (isToday(currentDateInMs)) {
      groupedBadges[0].data.push(currBadge)
      return result
    } else if (isThisWeek(currentDateInMs)) {
      groupedBadges[1].data.push(currBadge)
      return result
    } else if (isThisMonth(currentDateInMs)) {
      groupedBadges[2].data.push(currBadge)
      return result
    } else if (isThisYear(currentDateInMs)) {
      groupedBadges[3].data.push(currBadge)
      return result
    } else {
      groupedBadges[4].data.push(currBadge)
    }
    return result
  }, [])

  // if data arr is empty then do not return it => do not render that group
  return groupedBadges.filter((group) => group.data.length)
}

export const eighteenYearsAgo = today.setFullYear(today.getFullYear() - 18)
// temp
export function getImageSource(source?: string): ImageURISource {
  return !source ? require('../../assets/icon.png') : { uri: source }
}

// todo: when backend is prepared make categories dynamic
export const categories: MyBadgeCategory[] = [
  {
    id: 1,
    label: Category.Causes,
    iconName: 'ios-help-buoy',
    gradientColors: ['#ff5b94', '#8441a4'],
  },
  {
    id: 2,
    label: Category.Art,
    iconName: 'ios-brush',
    gradientColors: ['#7bf2e9', '#b65eba'],
  },
  {
    id: 3,
    label: Category.Music,
    iconName: 'ios-musical-notes',
    gradientColors: ['#6ee2f5', '#6454f0'],
  },
  {
    id: 4,
    label: Category.Gaming,
    iconName: 'game-controller-outline',
    gradientColors: ['#f869d5', '#5650de'],
  },
  {
    id: 12,
    label: Category.Style,
    iconName: 'ios-glasses',
    gradientColors: ['#ffcda5', '#ee4d5f'],
  },
  {
    id: 5,
    label: Category.Gaming,
    iconName: 'ios-basketball',
    gradientColors: ['#ffa62e', '#ea4d2c'],
  },
  {
    id: 6,
    label: Category.Animals,
    iconName: 'ios-paw',
    gradientColors: ['#64e8de', '#8a64eb'],
  },
  {
    id: 7,
    label: Category.Podcasts,
    iconName: 'ios-headset',
    gradientColors: ['#00ffed', '#00b8ba'],
  },
  {
    id: 8,
    label: Category.Vlogs,
    iconName: 'ios-headset',
    gradientColors: ['#ff6cab', '#7366f'],
  },
  {
    id: 9,
    label: Category.Travel,
    iconName: 'ios-airplane',
    gradientColors: ['#ffcf1b', '#ff881b'],
  },
  {
    id: 10,
    label: Category.Culinary,
    iconName: 'ios-restaurant',
    gradientColors: ['#b65eba', '#2e8de1'],
  },
  {
    id: 11,
    label: Category.Technology,
    iconName: 'ios-apps',
    gradientColors: ['#ff9897', '#f650a0'],
  },
]
