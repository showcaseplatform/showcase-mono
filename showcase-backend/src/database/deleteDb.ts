import { PrismaClient } from '.prisma/client'

export const deleteDb = async (prisma: PrismaClient) => {
  console.log('💥 Delete database: ', process.env.DATABASE_URL)
  await prisma.expoAdmin.deleteMany()

  //add data models WITH dependecies here
  await prisma.cause.deleteMany()
  await prisma.user.deleteMany()
}
