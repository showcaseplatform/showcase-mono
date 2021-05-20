import validator from 'validator'
import { auth, firestore as db, FieldValue } from '../../services/firestore'
import { twilio as twilioConfig } from '../../config'
import { twilio } from '../../services/twilio'
import {
  NewSmsVerification,
  GetPhoneCodeRequestBody,
  SmsVerification,
  TwilioSmsInput,
} from '../../types/auth'
import Boom from 'boom'
import { prisma } from '../../services/prisma'
import { User } from '@prisma/client'
import { registerUser } from '../../services/authy'

// todo: later we can add a time length for the "ban" if too many attempts
const MAX_CODE_SEND = 20
const MAX_ENTER_ATTEMP = 8
const CODE_EXPIRATION_SEC = 90000 // Expires in 90 sec

const validatePhoneNumber = ({ areaCode, phone }: GetPhoneCodeRequestBody): Promise<string> => {
  const phoneNumber = `+${areaCode + phone}`
  return new Promise((resolve, reject) => {
    if (phone && areaCode && validator.isMobilePhone(phoneNumber)) {
      resolve(phoneNumber)
    } else {
      reject('Invalid mobile phone number format')
    }
  })
}

const sendTwilioSmsWithCode = async ({ phoneNumber, code }: TwilioSmsInput) => {
  await twilio.messages.create({
    body: `Your Showcase login code is ${code}`,
    to: phoneNumber,
    from: twilioConfig.from,
  })
}

const generateSmsCode = (): number => {
  return Math.floor(Math.random() * 899999 + 100000)
}

const generateExpirationTime = (): number => {
  return Date.now() + 1 * CODE_EXPIRATION_SEC
}

const handleFirstAttempt = async ({
  isNewUser,
  phoneNumber,
}: {
  isNewUser: boolean
  phoneNumber: string
}) => {
  const code = generateSmsCode()
  const verification: SmsVerification & NewSmsVerification = {
    code,
    expiration: generateExpirationTime(),
    valid: true,
    codesSent: 1,
    codesSentSinceValid: 1,
    attemptsEnteredSinceValid: 0,
    attemptsEntered: 0,
  }

  if (isNewUser) {
    verification.phoneNumber = phoneNumber
  }

  await sendTwilioSmsWithCode({ phoneNumber, code })
  await db.collection('unverifiedsmsverifications').doc(phoneNumber.substring(1)).set(verification)
}

const handleFollowingAttempts = async ({
  existingAttemptDoc,
  phoneNumber,
}: {
  existingAttemptDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  phoneNumber: string
}) => {
  const existingAttempt = existingAttemptDoc.data() as SmsVerification
  if (
    existingAttempt.codesSent > MAX_CODE_SEND ||
    existingAttempt.attemptsEnteredSinceValid > MAX_ENTER_ATTEMP
  ) {
    throw Boom.paymentRequired('Too many attempts with this number')
  } else {
    let code = existingAttempt.code
    if (!existingAttempt.valid) {
      code = generateSmsCode()
    }
    await sendTwilioSmsWithCode({ phoneNumber, code })
    const updatedSettings: SmsVerification = {
      valid: true,
      codesSent: FieldValue.increment(1),
      codesSentSinceValid: FieldValue.increment(1),
      attemptsEnteredSinceValid: 0,
      attemptsEntered: 0,
      expiration: generateExpirationTime(),
      code,
    }
    await existingAttemptDoc.ref.update(updatedSettings)
  }
}

const sendSmsWithCode = async (user: User) => {
  let existingAttemptRef = db.collection('unverifiedsmsverifications').doc(phoneNumber.substring(1))
  const existingAttemptDoc = await existingAttemptRef.get()
  if (!existingAttemptDoc.exists) {
    return handleFirstAttempt({ isNewUser, phoneNumber })
  } else {
    return handleFollowingAttempts({ existingAttemptDoc, phoneNumber })
  }
}

export const findOrCreateUser = async (phone: string) => {
  let user = await prisma.user.findUnique({
    where: {
      phone,
    },
  })
  if (!user) {
    const authyId = await registerUser(phone)
    console.log({ authyId })
    user = await prisma.user.create({
      data: {
        phone,
        authyId,
      },
    })
  }
  return user
}

export const sendPhoneCode = async ({ phone, areaCode }: GetPhoneCodeRequestBody) => {
  const phoneNumber = await validatePhoneNumber({ areaCode, phone })
  const user = await findOrCreateUser(phoneNumber)
  await sendSmsWithCode(user)
}
