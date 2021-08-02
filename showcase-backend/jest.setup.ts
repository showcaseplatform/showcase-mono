import { deleteDb } from './src/database/deleteDb'
import { prisma } from './src/services/prisma'

jest.setTimeout(30000)

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await deleteDb(prisma)
  await prisma.$disconnect()
})
