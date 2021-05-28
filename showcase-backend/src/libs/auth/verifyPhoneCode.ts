import { auth } from '../../services/firestore'
import prisma from '../../services/prisma'
import Boom from 'boom'
import { VerifyPhoneCodeInput, VerifyPhoneCodeResponse } from './types/verifyPhoneCode.type'
import { createNewUser } from '../user/createNewUser'

const INCREMENT_WITH_ONE = {
  increment: 1,
}

const resetVerification = async (phone: string) => {
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

const incrementVerificationCount = async (phone: string) => {
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

const validateSmsCode = async ({ phone, code }: { phone: string; code: string }) => {
  const verification = await prisma.smsVerification.findUnique({
    where: {
      phone,
    },
  })

  if (!verification) {
    throw Boom.notFound('No verification code sent to that number!', `${phone}`)
  }

  const timeNow = new Date()

  let error = null
  if (verification.code !== code) {
    error = 'custom/code-does-not-match'
  } else if (!verification.valid) {
    error = 'custom/code-already-used'
  } else if (timeNow > verification.expiration) {
    error = 'custom/code-expired'
  }
  if (error) {
    await incrementVerificationCount(phone)
    throw Boom.notAcceptable(error, { phone, code })
  } else {
    await resetVerification(phone)
  }
}

const findOrCreateUser = async ({ phone, areaCode }: { phone: string; areaCode: string }) => {
  try {
    const { uid } = await auth().getUserByPhoneNumber(phone)
    return { authId: uid, isNewUser: false }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      const { authId } = await createNewUser({ phone, areaCode })
      return { authId, isNewUser: true }
    }
    throw error
  }
}

export const verifyPhoneCode = async ({
  code,
  phone: phoneNums,
  areaCode,
}: VerifyPhoneCodeInput): Promise<VerifyPhoneCodeResponse> => {
  const phone = `+${areaCode + phoneNums}`
  await validateSmsCode({ phone, code })
  const { authId, isNewUser } = await findOrCreateUser({ phone, areaCode })
  const token = await auth().createCustomToken(authId)
  return { token, isNewUser }
}
