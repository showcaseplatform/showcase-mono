import Boom from 'boom'
import { UpdateExchangeRatesCronJobRegister } from './updateExchangeRates'

export class ShowcaseCron {
  updateExchangeRatesCronJobRegister: UpdateExchangeRatesCronJobRegister

  constructor() {
    this.updateExchangeRatesCronJobRegister = new UpdateExchangeRatesCronJobRegister()
  }

  init() {
    try {
      this.updateExchangeRatesCronJobRegister.init()
      console.log('🚀 Daily exchange rate update cron job register started')
    } catch (error) {
      throw Boom.internal('ShowcaseCron cron init failed', { error })
    }
  }
}
