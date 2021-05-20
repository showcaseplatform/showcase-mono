import { Client } from 'authy-client'
import { authy } from '../config'
import parsePhoneNumber from 'libphonenumber-js'
import Boom from 'boom'

const authyClient = new Client({ key: authy.key })
console.log(authy.key)

const registerUser = async (phone: string) => {
  const phoneNumber  = parsePhoneNumber(phone)
  if (!phoneNumber) {
    throw Boom.badData('Invalid phoneNumber')
  }

  const {
    user: { id: authyId },
  } = await authyClient.registerUser({
    countryCode: phoneNumber.country,
    email: 'marci@fidy.hu', // todo: figure out how to deal with email
    phone: phoneNumber.nationalNumber,
  })

  return authyId
}

export { registerUser }
