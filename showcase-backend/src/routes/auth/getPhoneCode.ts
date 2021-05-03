/* eslint-disable promise/no-nesting */
import { auth } from 'firebase-admin'
import validator from 'validator'
import { firestore as db, FieldValue } from '../../services/firestore'
import { twilio as twilioConfig } from '../../config'
import { twilio } from '../../services/twilio'
import {
  NewSmsVerification,
  GetPhoneCodeRequestBody,
  GetPhoneCodeResponse,
  SmsVerification,
  TwilioSmsInput,
} from '../../types/auth'

// todo: later we can add a time length for the "ban" if too many attempts
const MAX_CODE_SEND = 20
const MAX_ENTER_ATTEMP = 8
const CODE_EXPIRATION_SEC = 90000 // Expires in 90 sec

const sendError = (error: string): GetPhoneCodeResponse => {
  console.error('Error while requesting phone code: ', error)
  return { success: false, error }
}

const generatePhoneNumber = ({ areaCode, phone }: GetPhoneCodeRequestBody): Promise<string> => {
  const phoneNumber = `+${areaCode + phone}`
  return new Promise((resolve, reject) => {
    if (phone && areaCode && validator.isMobilePhone(phoneNumber)) {
      resolve(phoneNumber)
    } else {
      reject('Invalid mobile phone number format')
    }
  })
}

const sendSmsCode = async ({ phoneNumber, code }: TwilioSmsInput) => {
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

const handleFirstRequest = async ({
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
    codesSent: 0,
    codesSentSinceValid: 0,
    attemptsEnteredSinceValid: 0,
    attemptsEntered: 0,
  }

  if (isNewUser) {
    verification.phoneNumber = phoneNumber
  }

  await sendSmsCode({ phoneNumber, code })
  await db.collection('unverifiedsmsverifications').doc(phoneNumber.substring(1)).set(verification)

  return { success: true }
}

const handleFollowingRequests = async ({
  existingDoc,
  phoneNumber,
}: {
  existingDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  phoneNumber: string
}) => {
  const existingAttempt = existingDoc.data() as SmsVerification
  if (
    existingAttempt.codesSent > MAX_CODE_SEND ||
    existingAttempt.attemptsEnteredSinceValid > MAX_ENTER_ATTEMP
  ) {
    return sendError('Too many attempts with this number')
  } else {
    let code = existingAttempt.code
    if (!existingAttempt.valid) {
      code = generateSmsCode()
    }
    await sendSmsCode({ phoneNumber, code })
    const updatedSettings: SmsVerification = {
      valid: true,
      codesSent: FieldValue.increment(1),
      codesSentSinceValid: FieldValue.increment(1),
      attemptsEnteredSinceValid: 0,
      attemptsEntered: 0,
      expiration: generateExpirationTime(),
      code,
    }
    await existingDoc.ref.update(updatedSettings)
    return { success: true }
  }
}

const handleSmsAuthRequests = async ({
  isNewUser,
  phoneNumber,
}: {
  isNewUser: boolean
  phoneNumber: string
}) => {
  let existingAttemptRef = db.collection('unverifiedsmsverifications').doc(phoneNumber.substring(1))
  const existingDoc = await existingAttemptRef.get()
  if (!existingDoc.exists) {
    return handleFirstRequest({ isNewUser, phoneNumber })
  } else {
    return handleFollowingRequests({ existingDoc, phoneNumber })
  }
}

const checkIfNewUser = async (phoneNumber: string) => {
  try {
    await auth().getUserByPhoneNumber(phoneNumber)
    return { isNewUser: false }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return { isNewUser: true }
    }
    throw error
  }
}

export const getPhoneCodeHandler = async ({
  phone,
  areaCode,
}: GetPhoneCodeRequestBody): Promise<GetPhoneCodeResponse> => {
  try {
    const phoneNumber = await generatePhoneNumber({ areaCode, phone })
    const { isNewUser } = await checkIfNewUser(phoneNumber)
    const { success } = await handleSmsAuthRequests({ isNewUser, phoneNumber })
    return { success }
  } catch (error) {
    return sendError(error)
  }
}
