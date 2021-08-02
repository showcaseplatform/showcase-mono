import { PrismaClient } from '.prisma/client'

export const addCurrencyRatesFixture = async (prisma: PrismaClient) => {
  await prisma.currencyRate.createMany({
    data: {
      EUR: 0.822265,
      GBP: 0.707141,
      USD: 1,
    },
  })
}
