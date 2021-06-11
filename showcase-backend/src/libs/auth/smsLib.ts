import validator from 'validator'
import { SendPhoneCodeInput, SendPhoneCodeResponse } from './types/sendPhoneCode.type'
import { myTwilio } from '../../services/twilio'
import moment from 'moment'
import {
  AUTH_CODE_EXPIRATION,
  AUTH_MAX_CODE_SEND,
  AUTH_MAX_ENTER_ATTEMP,
} from '../../consts/businessRules'
import { AuthLib } from './authLib'
import { GraphQLError } from 'graphql'
import { VerifyPhoneCodeInput, VerifyPhoneCodeResponse } from './types/verifyPhoneCode.type'

import { SmsVerificationCreateInput } from '@generated/type-graphql'
import {
  findUniqueVerification,
  incrementVerificationCount,
  resetVerification,
  upsertVerification,
} from '../database/smsVerification.repo'
interface SmsInput {
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
    phone,
    areaCode,
  }: VerifyPhoneCodeInput): Promise<VerifyPhoneCodeResponse> => {
    const validPhone = await this.validatePhoneNumber({ areaCode, phone })
    await this.validateCode({ phone: validPhone, code })
    const { authId, isNewUser } = await AuthLib.findOrCreateNewUser({ phone: validPhone, areaCode })
    const token = await AuthLib.getCustomToken(authId)
    return { token, isNewUser }
  }

  validateCode = async ({ phone, code }: SmsInput) => {
    try {
      await this.customVerificationValidation(phone)
      await myTwilio.checkVerificationToken(phone, code)
      await resetVerification(phone)
    } catch (error) {
      await incrementVerificationCount(phone)
      throw new GraphQLError(error)
    }
  }

  sendSmsAndUpdateVerification = async (phone: string) => {
    const verificationData: SmsVerificationCreateInput = {
      phone,
      expiration: this.generateExpirationDate(),
      valid: true,
      codesSent: 1,
      codesSentSinceValid: 1,
      attemptsEnteredSinceValid: 0,
      attemptsEntered: 0,
    }

    await this.checkIfCodeSentLimitExceeded(phone)
    await myTwilio.sendVerificationToken(phone)

    return await upsertVerification(verificationData)
  }

  checkIfCodeSentLimitExceeded = async (phone: string) => {
    const existingVerification = await findUniqueVerification(phone)

    if (!existingVerification) return

    const { codesSent, attemptsEnteredSinceValid } = existingVerification
    if (codesSent > AUTH_MAX_CODE_SEND || attemptsEnteredSinceValid > AUTH_MAX_ENTER_ATTEMP) {
      throw new GraphQLError('Too many attempts with this number')
    }
  }

  customVerificationValidation = async (phone: string) => {
    const verification = await findUniqueVerification(phone)

    if (!verification) {
      throw new GraphQLError('No verification code sent to that number!')
    } else if (!verification.valid) {
      throw new GraphQLError('Code already used!')
    } else if (new Date() > verification.expiration) {
      throw new GraphQLError('Code expired!')
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

  generateExpirationDate = (): Date => {
    return moment().add(AUTH_CODE_EXPIRATION, 'seconds').toDate()
  }
}

const smsLib = new SmsLib()
export { smsLib }
