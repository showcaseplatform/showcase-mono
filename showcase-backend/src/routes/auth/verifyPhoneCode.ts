/* eslint-disable promise/no-nesting */
import { auth } from 'firebase-admin'
import { firestore as db, FieldValue } from '../../services/firestore'
import { v5 as uuidv5 } from 'uuid'
import {
  PhoneNumber,
  SmsVerification,
  TwilioSmsInput,
  VerifyPhoneCodeResponse,
  VerifyPhoneRequestBody,
} from '../../types/auth'

const uuidNamespace = 'b01abb38-c109-4b71-9136-a2aa73ddde27' // todo: maybe outsource to config
const europeanCountryCodes = [
  '39',
  '43',
  '32',
  '387',
  '385',
  '420',
  '45',
  '372',
  '358',
  '33',
  '49',
  '350',
  '30',
  '36',
  '353',
  '371',
  '382',
  '31',
  '47',
  '48',
  '351',
  '7',
  '421',
  '386',
  '34',
  '46',
  '41',
]

const sendError = (error: any) => {
  console.error('Error happened while phone code verification', error)
  return { error }
}

const resetVerification = async (
  docRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) => {
  await docRef.update({
    valid: false,
    codesSentSinceValid: 0,
    attemptsEnteredSinceValid: 0,
  })
}

const incrementVerificationCount = async (
  docRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) => {
  await docRef.update({
    codeSent: FieldValue.increment(1),
    codesSentSinceValid: FieldValue.increment(1),
    attemptsEntered: FieldValue.increment(1),
    attemptsEnteredSinceValid: FieldValue.increment(1),
  })
}

const validatePhoneCode = async ({ phoneNumber, code }: TwilioSmsInput) => {
  const verificationRef = db.collection('unverifiedsmsverifications').doc(phoneNumber)
  const verificationSnapshot = await verificationRef.get()

  if (!verificationSnapshot.exists) {
    throw 'No verification code sent to that number!'
  }

  const verification = verificationSnapshot.data() as SmsVerification
  const timeNow = Date.now()

  let error = null
  if (verification.code.toString() !== code.toString()) {
    error = 'custom/code-does-not-match'
  } else if (!verification.valid) {
    error = 'custom/code-already-used'
  } else if (timeNow > verification.expiration) {
    error = 'custom/code-expired'
  }
  if (error) {
    await incrementVerificationCount(verificationRef)
    throw error
  } else {
    await resetVerification(verificationRef)
  }
}

const createUser = async ({ phone, areaCode }: PhoneNumber) => {
  const customUserId = uuidv5(phone, uuidNamespace)

  const user = await auth().createUser({
    phoneNumber: '+' + areaCode + '' + phone,
    // phoneLocal: phone, // todo: this is not allowed
    // areaCode: areaCode, // todo: this is not allowed
    uid: customUserId,
  })
  let userCurrency = 'USD' //default USD

  if (areaCode + '' === '44') {
    userCurrency = 'GBP'
  } else if (europeanCountryCodes.indexOf(areaCode + '') > -1) {
    userCurrency = 'EUR'
  }

  await db
    .collection('users')
    .doc(user.uid)
    .set({
      phoneNumber: '+' + areaCode + '' + phone,
      phoneLocal: phone,
      areaCode: areaCode,
      liked: {},
      followingCount: 0,
      followersCount: 0,
      uid: customUserId,
      currency: userCurrency,
      badgesCount: 0,
      chats: {},
      balances: {
        usd: 0,
        eur: 0,
        gbp: 0,
      },
    })

  return { uid: user.uid }
}

const getUserUid = async ({ phone, areaCode }: PhoneNumber) => {
  const phoneNumber = areaCode + '' + phone
  try {
    const { uid } = await auth().getUserByPhoneNumber('+' + phoneNumber)
    return { uid, newUser: false }
  } catch (error) {
    console.log('Get user error', { error })
    if (error.code === 'auth/user-not-found') {
      const { uid } = await createUser({ phone, areaCode })
      return { uid, newUser: true }
    }
    throw error
  }
}

export const verifyPhoneCode = async ({
  code,
  phone,
  areaCode,
}: VerifyPhoneRequestBody): Promise<VerifyPhoneCodeResponse> => {
  try {
    const phoneNumber = areaCode + '' + phone
    await validatePhoneCode({ phoneNumber, code })
    const { uid, newUser } = await getUserUid({ phone, areaCode })
    const token = await auth().createCustomToken(uid)
    return { token, newUser }
  } catch (error) {
    return sendError(error)
  }
}
