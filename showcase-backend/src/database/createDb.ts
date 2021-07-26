import { PrismaClient } from '@prisma/client'
import { cleanDb } from './deleteDb'
import { addCausesFixture } from './fixtures/causes.fixture'
import { UserSeeder } from './fixtures/creators.fixture'
import { addCurrencyRatesFixture } from './fixtures/currencyRates.fixture'


export const createTestDb = async (prisma: PrismaClient): Promise<void> => {
    const userSeeder = new UserSeeder(prisma, 5, 3)
    await cleanDb(prisma)
    await addCurrencyRatesFixture(prisma)
    await addCausesFixture(prisma)
    await userSeeder.addUsersFixture()
  }