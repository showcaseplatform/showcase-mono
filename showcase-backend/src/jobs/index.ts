import { UpdateExchangeRatesCronJobRegister } from './updateExchangeRates'

export class ShowcaseCron {
  updateExchangeRatesCronJobRegister: UpdateExchangeRatesCronJobRegister

  constructor() {
    this.updateExchangeRatesCronJobRegister = new UpdateExchangeRatesCronJobRegister()
  }

  init(): void {
    try {
      this.updateExchangeRatesCronJobRegister.init()
      console.log('🚀 Daily exchange rate update cron job register started')
    } catch (error) {
      throw new Error('ShowcaseCron init failed')
    }
  }
}
