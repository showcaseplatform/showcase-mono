import validator from 'validator'
import { v4 as uuidv4 } from 'uuid'
import { Uid } from '../../types/user'
import Boom from 'boom'
import { CURRENCIES } from '../../consts/currencies'
import moment from 'moment'
import {
  PROFILE_MAX_BIO_LENGTH,
  PROFILE_MAX_USERNAME_LENGTH,
  PROFILE_MAX_DISPLAY_NAME_LENGTH,
  PROFILE_MIN_USER_AGE,
} from '../../consts/businessRules'
import { Currency } from '@generated/type-graphql'
import prisma from '../../services/prisma'
import { UpdateProfileInput } from './types/updateProfile.type'
import { FileUpload } from '../../types/fileUpload'
import { GraphQLError } from 'graphql'
import { uploadFileToS3Bucket } from '../../services/S3'
import {Profile } from '@prisma/client'

const validateBio = (bio: string) => {
  if (bio.length <= PROFILE_MAX_BIO_LENGTH) {
    return bio
  } else {
    throw Boom.badData('Invalid bio')
  }
}

const validateEmail = async (email: string, uid: Uid) => {
  // todo: is it neccesary to do this check this in db? or enough to add unique constrain
  const profileWithSameEmail = await prisma.profile.findMany({
    where: {
      email,
    },
    select: {
      email: true
    }
  })

  if (
    (validator.isEmail(email) && profileWithSameEmail.length === 0) ||
    profileWithSameEmail[0]?.email === email
  ) {
    return email
  } else {
    throw Boom.badData('Invalid email')
  }
}

const validateUsername = async (username: string, uid: Uid) => {
   // todo: is it neccesary to do this check this in db? or enough to add unique constrain
  const profileWithSameUsername = await prisma.profile.findMany({
    where: {
      username,
    },
    select: {
      username: true
    }
  })

  if (
    username.length <= PROFILE_MAX_USERNAME_LENGTH &&
    (profileWithSameUsername.length === 0 || profileWithSameUsername[0].username === username) &&
    /^[a-zA-Z0-9_]+$/g.test(username)
  ) {
    return username
  } else {
    throw Boom.badData('Invalid username')
  }
}

const validateDisplayName = (displayName: string) => {
  // todo: display name can be the same?
  if (displayName.length <= PROFILE_MAX_DISPLAY_NAME_LENGTH) {
    return displayName
  } else {
    throw Boom.badData('Invalid display name')
  }
}

const validateBirthdate = (birthDate: Date) => {
  if (birthDate < moment().add(-PROFILE_MIN_USER_AGE, 'years').toDate()) {
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

const uploadAvatarImg = async (fileData: FileUpload) => {
  const { base64DataURL, mimeType } = fileData

  if (!['image/jpeg', 'image/png'].includes(mimeType)) {
    throw new GraphQLError('Only JPEG and PNG file allowed.')
  }

  const fileExtension = mimeType.split('/')[1]
  const id = `avatars/${uuidv4()}.${fileExtension}`

  const buffer = Buffer.from(base64DataURL, 'base64')

  await uploadFileToS3Bucket({
    Key: id,
    ContentType: mimeType,
    buffer,
  })

  return id
}

export const updateProfile = async (input: UpdateProfileInput, avatarImg: FileUpload, uid: Uid) => {
  const { bio, email, username, displayName, birthDate, currency } = input

  const updateData = {} as Partial<Omit<Profile, 'id'>>

  if (bio) {
    updateData.bio = validateBio(bio)
  }

  if (email) {
    updateData.email = await validateEmail(email, uid)
  }

  if (username) {
    updateData.username = await validateUsername(username, uid)
  }

  if (displayName) {
    updateData.displayName = validateDisplayName(displayName)
  }

  if (birthDate) {
    updateData.birthDate = validateBirthdate(new Date(birthDate))
  }

  if (currency) {
    updateData.currency = validateCurrency(currency)
  }

  if (avatarImg) {
    updateData.avatarId = await uploadAvatarImg(avatarImg)
  }

  if (Object.keys(updateData).length >= 1) {
    return await prisma.profile.update({
      where: {
        id: uid,
      },
      data: {
        ...updateData,
      },
    })
  } else {
    throw new GraphQLError('There wasnt any data to update')
  }
}
