import { prisma } from '../services/prisma'

export const findProfile = async (id: string) => {
  return await prisma.profile.findUnique({
    where: {
      id,
    },
  })
}
