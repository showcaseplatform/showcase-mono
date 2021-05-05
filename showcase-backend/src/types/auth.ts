import firebase from 'firebase-admin'

export interface PhoneNumber {
  phone: string
  areaCode: string
}

export interface GetPhoneCodeRequestBody extends PhoneNumber {}

export interface GetPhoneCodeResponse {
  success: boolean
  error?: string
}

export interface VerifyPhoneRequestBody extends GetPhoneCodeRequestBody {
  code: number
}


export interface VerifyPhoneCodeResponse {
  newUser?: boolean
  token?: string
  error?: string
}

export interface TwilioSmsInput {
  phoneNumber: string
  code: number
}

export interface SmsVerification {
  code: number
  expiration: number
  valid: boolean
  codesSent: number | firebase.firestore.FieldValue
  codesSentSinceValid: number | firebase.firestore.FieldValue
  attemptsEnteredSinceValid: number | firebase.firestore.FieldValue
  attemptsEntered: number | firebase.firestore.FieldValue
}

export interface NewSmsVerification extends SmsVerification {
  phoneNumber?: string
}
