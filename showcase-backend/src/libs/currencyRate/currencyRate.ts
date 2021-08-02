import axios from 'axios'
import { prisma } from '../../services/prisma'
import { openExchange } from '../../config'

export class CurrencyRateLib {
  static async getLatestExchangeRates() {
    const currencyRates = await prisma.currencyRate.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    })
    if (currencyRates) {
      return currencyRates
    } else {
      throw new Error('Empty currencies')
    }
  }

  static async updateDatabaseExchangeRates() {
    const response = await axios.get(`${openExchange.url}/api/latest.json?app_id=${openExchange.appId}`)
    const rates = response?.data?.rates
    if (rates) {
      const { EUR, GBP, USD } = rates
      await prisma.currencyRate.create({
        data: {
          EUR,
          GBP,
          USD,
        },
      })
      console.log('Currency rates updated: ', { EUR }, { GBP }, { USD })
    } else {
      throw new Error('Failed to download currency rates')
    }
  }
}
