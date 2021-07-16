import validator from 'validator'
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
import { FileType, FileUpload } from '../../utils/types/fileUpload.type'
import { GraphQLError } from 'graphql'
import { Profile } from '@prisma/client'
import { uploadFile } from '../../utils/fileUpload'
import { findProfile } from '../database/profile.repo'

const validateBio = (bio: string) => {
  if (bio.length <= PROFILE_MAX_BIO_LENGTH) {
    return bio
  } else {
    throw Boom.badData('Invalid bio')
  }
}

const validateEmail = async (email: string) => {
  // todo: is it neccesary to do this check this in db? or enough to add unique constrain
  const profileWithSameEmail = await prisma.profile.findMany({
    where: {
      email,
    },
    select: {
      email: true,
    },
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
      username: true,
    },
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

const updateAvatarImg = async (avatarImg: FileUpload, uid: Uid) => {
  const profile = await findProfile(uid)
  const { Key: avatarId } = await uploadFile({
    fileData: avatarImg,
    fileType: FileType.avatar,
    updateKey: profile?.avatarId || undefined,
  })
  return avatarId
}

export const updateProfile = async (input: UpdateProfileInput, avatarImg: FileUpload, uid: Uid) => {
  const { bio, email, username, displayName, birthDate, currency } = input || {}

  const updateData = {} as Partial<Omit<Profile, 'id'>>

  if (bio != undefined) {
    updateData.bio = validateBio(bio)
  }

  if (email != undefined) {
    updateData.email = await validateEmail(email)
  }

  if (username) {
    updateData.username = await validateUsername(username, uid)
  }

  if (displayName) {
    updateData.displayName = validateDisplayName(displayName)
  }

  if (birthDate != undefined) {
    updateData.birthDate = validateBirthdate(new Date(birthDate))
  }

  if (currency) {
    updateData.currency = validateCurrency(currency)
  }

  if (avatarImg != undefined) {
    updateData.avatarId = await updateAvatarImg(avatarImg, uid)
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
