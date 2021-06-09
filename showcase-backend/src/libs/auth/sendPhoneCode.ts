import validator from 'validator'
import { auth } from '../../services/firebase'
import { twilio as twilioConfig } from '../../config'
import { twilio } from '../../services/twilio'
import Boom from 'boom'
import prisma from '../../services/prisma'
import { SmsVerification } from '.prisma/client'
import { SendPhoneCodeInput, SendPhoneCodeResponse } from './types/sendPhoneCode.type'
import { AUTH_CODE_EXPIRATION, AUTH_MAX_CODE_SEND, AUTH_MAX_ENTER_ATTEMP } from '../../consts/businessRules'
import moment from 'moment'

export interface TwilioSmsInput {
  phone: string
  code: string
}

const validatePhoneNumber = ({ areaCode, phone }: SendPhoneCodeInput): Promise<string> => {
  const phoneNumber = `+${areaCode + phone}`
  return new Promise((resolve, reject) => {
    if (phone && areaCode && validator.isMobilePhone(phoneNumber)) {
      resolve(phoneNumber)
    } else {
      reject('Invalid mobile phone number format')
    }
  })
}

const sendTwilioSmsWithCode = async ({ phone, code }: TwilioSmsInput) => {
  await twilio.messages.create({
    body: `Your Showcase login code is ${code}`,
    to: `${phone}`,
    from: twilioConfig.from,
  })
}

const generateSmsCode = (): string => {
  return Math.floor(Math.random() * 899999 + 100000).toString()
}

const generateExpirationDate = (): Date => {
  return moment().add(AUTH_CODE_EXPIRATION, 'seconds').toDate()
}

const handleFirstAttempt = async (phone: string) => {
  const code = generateSmsCode()
  const verificationUpdateData = {
    phone,
    code,
    expiration: generateExpirationDate(),
    valid: true,
    codesSent: 1,
    codesSentSinceValid: 1,
    attemptsEnteredSinceValid: 0,
    attemptsEntered: 0,
  }

  await sendTwilioSmsWithCode({ phone, code })

  return await prisma.smsVerification.upsert({
    where: {
      phone,
    },
    update: {
      ...verificationUpdateData,
    },
    create: {
      ...verificationUpdateData,
    },
  })
}

const handleFollowingAttempts = async ({
  verification,
  phone,
}: {
  verification: SmsVerification
  phone: string
}) => {
  let { codesSent, attemptsEnteredSinceValid, code, valid } = verification
  if (codesSent > AUTH_MAX_CODE_SEND || attemptsEnteredSinceValid > AUTH_MAX_ENTER_ATTEMP) {
    throw Boom.paymentRequired('Too many attempts with this number')
  } else {
    if (!valid) {
      code = generateSmsCode()
    }
    await sendTwilioSmsWithCode({ phone, code })

    return await prisma.smsVerification.update({
      where: {
        phone,
      },
      data: {
        valid: true,
        codesSent: {
          increment: 1,
        },
        codesSentSinceValid: {
          increment: 1,
        },
        attemptsEnteredSinceValid: 0,
        attemptsEntered: 0,
        expiration: generateExpirationDate(),
        code,
      },
    })
  }
}

const sendSmsWithCode = async (phone: string) => {
  const existingVerification = await prisma.smsVerification.findUnique({
    where: {
      phone,
    },
  })
  if (!existingVerification) {
    return handleFirstAttempt(phone)
  } else {
    return handleFollowingAttempts({ verification: existingVerification, phone })
  }
}

export const checkIfNewUser = async (phone: string) => {
  try {
    await auth().getUserByPhoneNumber(phone)
    return false
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return true
    }
    throw error
  }
}

export const sendPhoneCode = async ({
  phone,
  areaCode,
}: SendPhoneCodeInput): Promise<SendPhoneCodeResponse> => {
  const validPhone = await validatePhoneNumber({ areaCode, phone })
  const isNewUser = await checkIfNewUser(validPhone)
  const { valid } = await sendSmsWithCode(validPhone)
  return { isNewUser, valid }
}
