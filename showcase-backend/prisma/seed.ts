import { PrismaClient } from '@prisma/client'
import { cleanDb } from './cleanDb'
import { addCausesFixture } from './fixtures/causes.fixture'
import { addCreatorsFixture } from './fixtures/creators.fixture'
import { addCurrencyRatesFixture } from './fixtures/currencyRates.fixture'

const prisma = new PrismaClient()

const createTestDb = async () => {
  await cleanDb(prisma)
  await addCurrencyRatesFixture(prisma)
  await addCausesFixture(prisma)
  await addCreatorsFixture(prisma)
}

createTestDb()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
