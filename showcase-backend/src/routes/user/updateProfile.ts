import { firestore as db } from '../../services/firestore'
import validator from 'validator'
import { Currency, UpdateProfileRequest, User } from '../../types/user'
import Boom from 'boom'
import { CURRENCIES } from '../../consts/currencies'

const MAX_BIO_LENGTH = 240
const MAX_USERNAME_LENGTH = 28
const MAX_DISPLAY_NAME_LENGTH = 36
const MIN_USER_BRITH_DATE = new Date(2005, 12, 31)

interface UpdateProfileInput extends UpdateProfileRequest {
  user: User
}

interface UpdateData extends UpdateProfileRequest {
  birthDay?: number
  birthMonth?: number
  birthYear?: number
}

const validateBio = (bio: string) => {
  if (bio.length <= MAX_BIO_LENGTH) {
    return bio
  } else {
    throw Boom.badData('Invalid bio')
  }
}

const validateEmail = async (email: string, user: User) => {
  const { empty } = await db.collection('users').where('email', '==', email).get()
  if ((validator.isEmail(email) && empty) || user?.email === email) {
    return email
  } else {
    throw Boom.badData('Invalid email')
  }
}

const validateUsername = async (username: string, user: User) => {
  const { empty } = await db.collection('users').where('username', '==', username).get()
  if (
    username.length <= MAX_USERNAME_LENGTH &&
    (empty || user.username === username) &&
    /^[a-zA-Z0-9_]+$/g.test(username)
  ) {
    return username
  } else {
    throw Boom.badData('Invalid username')
  }
}

const validateDisplayName = (displayName: string) => {
  if (displayName.length <= MAX_DISPLAY_NAME_LENGTH) {
    return displayName
  } else {
    throw Boom.badData('Invalid display name')
  }
}

const validateBirthdate = (birthDate: Date) => {
  if (birthDate < MIN_USER_BRITH_DATE) {
    return birthDate
  } else {
    throw Boom.badData('Invalid birth date')
  }
}
const validateCurrency = (currency: Currency) => {
  if (CURRENCIES.indexOf(currency) > -1) {
    return currency
  } else {
    throw Boom.badData('Invalid currency')
  }
}

export const updateProfile = async ({
  bio,
  email,
  username,
  displayName,
  birthDate,
  user,
  avatar,
  currency,
}: UpdateProfileInput) => {
  const updateData: UpdateData = {} as UpdateData

  if (bio) {
    updateData.bio = validateBio(bio)
  }

  if (email) {
    updateData.email = await validateEmail(email, user)
  }

  if (username) {
    updateData.username = await validateUsername(username, user)
  }

  if (displayName) {
    updateData.displayName = validateDisplayName(displayName)
  }

  if (birthDate) {
    updateData.birthDate = validateBirthdate(new Date(birthDate))
    updateData.birthDay = updateData.birthDate.getDate()
    updateData.birthMonth = updateData.birthDate.getMonth()
    updateData.birthYear = updateData.birthDate.getFullYear()
  }

  if (currency) {
    updateData.currency = validateCurrency(currency)
  }

  if (avatar) {
    updateData.avatar =
      'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/images%2F' +
      user.uid +
      '?alt=media'
  }

  if (Object.keys(updateData).length >= 1) {
    await db.collection('users').doc(user.uid).update(updateData)
    const userDoc = await db.collection('users').doc(user.uid).get()
    return { user: { ...userDoc.data() as User } }
  } else {
    return { user }
  }
}
