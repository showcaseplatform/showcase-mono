import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export { prisma, PrismaClient, Prisma }
export default prisma 
