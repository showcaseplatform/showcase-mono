import prisma from '../../services/prisma'
import { Uid } from '../../types/user'

export const findUserByPhone = async (phone: string) => {
  return await prisma.user.findUnique({
    where: {
      phone,
    },
  })
}

export const findUserById = async (id: Uid) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  })
}

export const findUserWithFinancialInfo = async (id: Uid) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      balance: true,
      paymentInfo: true,
      cryptoWallet: true,
    },
  })
}

