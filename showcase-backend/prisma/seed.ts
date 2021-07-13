import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { cleanDb } from './cleanDb'
import { addCausesFixture } from './fixtures/causes.fixture'
import { UserSeeder } from './fixtures/creators.fixture'
import { addCurrencyRatesFixture } from './fixtures/currencyRates.fixture'
// import { myS3 } from '../src/services/S3/s3'

const prisma = new PrismaClient()

const userSeeder = new UserSeeder(prisma, 5, 3)

const createTestDb = async () => {
  // await myS3.resetS3Bucket()
  await cleanDb(prisma)
  await addCurrencyRatesFixture(prisma)
  await addCausesFixture(prisma)
  await userSeeder.addUsersFixture()
}

createTestDb()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
