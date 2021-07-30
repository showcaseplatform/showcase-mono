import { PrismaClient } from '.prisma/client';

export const cleanDb = async (prisma: PrismaClient) => {
    // add data models WITHOUT dependecies here
    await prisma.expoAdmin.deleteMany()
    
    //add data models WITH dependecies here
    await prisma.cause.deleteMany()
    await prisma.user.deleteMany()

}