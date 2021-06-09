import validator from 'validator'
import { SendPhoneCodeInput, SendPhoneCodeResponse } from './types/sendPhoneCode.type'
import { twilio as twilioConfig } from '../../config'
import { twilio } from '../../services/twilio'
import moment from 'moment'
import {
  AUTH_CODE_EXPIRATION,
  AUTH_MAX_CODE_SEND,
  AUTH_MAX_ENTER_ATTEMP,
} from '../../consts/businessRules'
import { AuthLib } from './authLib'
import { prisma } from '../../services/prisma'
import { GraphQLError } from 'graphql'
import { VerifyPhoneCodeInput, VerifyPhoneCodeResponse } from './types/verifyPhoneCode.type'

const INCREMENT_WITH_ONE = {
  increment: 1,
}

interface TwilioSmsInput {
  phone: string
  code: string
}

class SmsLib {
  sendPhoneCode = async ({
    phone,
    areaCode,
  }: SendPhoneCodeInput): Promise<SendPhoneCodeResponse> => {
    const validPhone = await this.validatePhoneNumber({ areaCode, phone })
    const isNewUser = !(await AuthLib.isPhoneRegistered(validPhone))
    const { valid } = await this.sendSmsAndUpdateVerification(validPhone)
    return { isNewUser, valid }
  }

  verifyPhoneCode = async ({
    code,
    phone: phoneNums,
    areaCode,
  }: VerifyPhoneCodeInput): Promise<VerifyPhoneCodeResponse> => {
    const phone = `+${areaCode + phoneNums}`
    await this.validateCode({ phone, code })
    const { authId, isNewUser } = await AuthLib.findOrCreateNewUser({ phone, areaCode })
    const token = await AuthLib.getCustomToken(authId)
    return { token, isNewUser }
  }

  validateCode = async ({ phone, code }: { phone: string; code: string }) => {
    const verification = await prisma.smsVerification.findUnique({
      where: {
        phone,
      },
    })

    if (!verification) {
      throw new GraphQLError('No verification code sent to that number!')
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
      await this.incrementVerificationCount(phone)
      throw error
    } else {
      await this.resetVerification(phone)
    }
  }

  sendSmsAndUpdateVerification = async (phone: string) => {
    const verificationData = {
      phone,
      code: this.generateSmsCode(),
      expiration: this.generateExpirationDate(),
      valid: true,
      codesSent: 1,
      codesSentSinceValid: 1,
      attemptsEnteredSinceValid: 0,
      attemptsEntered: 0,
    }

    await this.validateSmsVerification(phone)
    this.sendTwilioSmsWithCode({ phone, code: verificationData.code })

    return await prisma.smsVerification.upsert({
      where: {
        phone,
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

  validateSmsVerification = async (phone: string) => {
    const existingVerification = await prisma.smsVerification.findUnique({
      where: {
        phone,
      },
    })

    if (!existingVerification) return

    const { codesSent, attemptsEnteredSinceValid } = existingVerification
    if (codesSent > AUTH_MAX_CODE_SEND || attemptsEnteredSinceValid > AUTH_MAX_ENTER_ATTEMP) {
      throw new GraphQLError('Too many attempts with this number')
    }
  }

  validatePhoneNumber = ({ areaCode, phone }: SendPhoneCodeInput): Promise<string> => {
    const phoneNumber = `+${areaCode + phone}`
    return new Promise((resolve, reject) => {
      if (phone && areaCode && validator.isMobilePhone(phoneNumber)) {
        resolve(phoneNumber)
      } else {
        reject('Invalid mobile phone number format')
      }
    })
  }

  sendTwilioSmsWithCode = async ({ phone, code }: TwilioSmsInput) => {
    await twilio.messages.create({
      body: `Your Showcase login code is ${code}`,
      to: `${phone}`,
      from: twilioConfig.from,
    })
  }

  generateSmsCode = (): string => {
    return Math.floor(Math.random() * 899999 + 100000).toString()
  }

  generateExpirationDate = (): Date => {
    return moment().add(AUTH_CODE_EXPIRATION, 'seconds').toDate()
  }

  incrementVerificationCount = async (phone: string) => {
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

  resetVerification = async (phone: string) => {
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
}

const smsLib = new SmsLib()
export { smsLib }
