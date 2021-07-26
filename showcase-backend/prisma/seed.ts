import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { createTestDb } from '../src/database/createDb'

const prisma = new PrismaClient()

// eslint-disable-next-line promise/catch-or-return
createTestDb(prisma)
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
