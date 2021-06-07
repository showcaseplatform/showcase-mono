import { CronJob } from 'cron'
import { CurrencyRateLib } from '../libs/currencyRate/currencyRate'

export class UpdateExchangeRatesCronJobRegister {
  init() {
    const job = new CronJob(
      // 16:30 every day
      '30 16 * * *',
      async () => {
        try {
          await CurrencyRateLib.updateDatabaseExchangeRates()
        } catch (error) {
          console.error('CRON JOB UpdateExchangeRatesCronJobRegister failed')
          console.error(error.stack)
        }
      },
      null,
      true
      // todo: add default timzone
    )
    job.start()
  }
}
