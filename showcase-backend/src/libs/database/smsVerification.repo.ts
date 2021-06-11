import { prisma } from '../../services/prisma'
import { SmsVerificationCreateInput } from '@generated/type-graphql'

const INCREMENT_WITH_ONE = {
  increment: 1,
}

export const incrementVerificationCount = async (phone: string) => {
  return await prisma.smsVerification.update({
    where: {
      phone,
    },
    data: {
      codesSent: INCREMENT_WITH_ONE,
      codesSentSinceValid: INCREMENT_WITH_ONE,
      attemptsEntered: INCREMENT_WITH_ONE,
      attemptsEnteredSinceValid: INCREMENT_WITH_ONE,
    },
  })
}

export const resetVerification = async (phone: string) => {
  return await prisma.smsVerification.update({
    where: {
      phone,
    },
    data: {
      valid: false,
      codesSentSinceValid: INCREMENT_WITH_ONE,
      attemptsEnteredSinceValid: INCREMENT_WITH_ONE,
    },
  })
}

export const upsertVerification = async (verificationData: SmsVerificationCreateInput) => {
  return await prisma.smsVerification.upsert({
    where: {
      phone: verificationData.phone,
    },
    update: {
      ...verificationData,
      codesSent: INCREMENT_WITH_ONE,
      codesSentSinceValid: INCREMENT_WITH_ONE,
    },
    create: {
      ...verificationData,
    },
  })
}

export const findUniqueVerification = async (phone: string) => {
  return await prisma.smsVerification.findUnique({
    where: {
      phone,
    },
  })
}
