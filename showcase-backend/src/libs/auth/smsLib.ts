import validator from 'validator'
import { SendPhoneCodeInput, SendPhoneCodeResponse } from './types/sendPhoneCode.type'
import { myTwilio } from '../../services/twilio'
import { AuthLib } from './authLib'
import { GraphQLError } from 'graphql'
import { VerifyPhoneCodeInput, VerifyPhoneCodeResponse } from './types/verifyPhoneCode.type'
import { jwtClient } from '../../services/jsonWebToken'
import { findUserByPhone } from '../database/user.repo'
import { env } from '../../config'

enum ErrorMessages {
  MissingVerificationCode = 'Missing parameter: code',
  InvalidPhoneNumber = 'Invalid phone number',
}

class SmsLib {
  sendPhoneCode = async ({
    phone,
    areaCode,
  }: SendPhoneCodeInput): Promise<SendPhoneCodeResponse> => {
    const validPhone = await this.validatePhoneNumber({ areaCode, phone })
    await myTwilio.sendVerificationToken(validPhone)
    return { success: true }
  }

  verifyPhoneCode = async ({
    code,
    phone,
    areaCode,
  }: VerifyPhoneCodeInput): Promise<VerifyPhoneCodeResponse> => {
    const validPhone = await this.validatePhoneNumber({ areaCode, phone })

    if (!code) {
      throw new GraphQLError(ErrorMessages.MissingVerificationCode)
    }

    if (env === 'development' && code === '000000') {
      console.log('❗❗ Code verification check skipped ❗❗')
    } else {
      await myTwilio.checkVerificationToken(validPhone, code)
    }

    let isNewUser = false
    let user = await findUserByPhone(validPhone)

    if(!user) {
      isNewUser = true
      user = await AuthLib.createNewUser(validPhone, areaCode)
    }

    const token = jwtClient.generateToken(user.id)
    return { token, isNewUser, user }
  }

  validatePhoneNumber = ({ areaCode, phone }: SendPhoneCodeInput): Promise<string> => {
    const phoneNumber = `+${areaCode + phone}`
    return new Promise((resolve, reject) => {
      if (phone && areaCode && validator.isMobilePhone(phoneNumber)) {
        resolve(phoneNumber)
      } else {
        reject(ErrorMessages.InvalidPhoneNumber)
      }
    })
  }
}

export const smsLib = new SmsLib()
