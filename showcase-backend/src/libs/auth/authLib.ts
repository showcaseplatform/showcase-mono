import { Currency, UserType } from '@prisma/client'
import { EUROPEAN_COUNTRY_CODES } from '../../consts/countryCodes'
import prisma from '../../services/prisma'
import { createRandomNames } from '../../utils/randoms'
import { jwtClient } from '../../services/jsonWebToken'
import { findUserById } from '../database/user.repo'

export enum AuthError {
  isOwnUser = "Not user's profile",
}

export const allUserTypes = Object.keys(UserType) as UserType[]
export class AuthLib {
  static getUserByToken = async (token: string) => {
    try {
      if (!token) {
        return null
      }

      const { id } = jwtClient.verifyToken(token.replace('Bearer ', ''))

      const user = await findUserById(id)

      if (user && user.isBanned !== true) {
        return user
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  static authChecker = ({ context }: any, roles: UserType[]) => {
    const { user } = context
    if (!user) {
      return false
    }
    if (!roles.includes(user.userType)) {
      return false
    }
    return true
  }

  static createNewUser = async (phone: string, areaCode: string) => {
    let currency: Currency = Currency.USD //default USD

    if (areaCode === '44') {
      currency = Currency.GBP
    } else if (EUROPEAN_COUNTRY_CODES.indexOf(String(areaCode)) > -1) {
      currency = Currency.EUR
    }

    const { displayName, username } = createRandomNames(phone)
    return await prisma.user.create({
      data: {
        phone,
        profile: {
          create: {
            displayName,
            username,
            currency,
          },
        },
        balance: {
          create: {
            EUR: 0,
            GBP: 0,
            USD: 0,
          },
        },
      },
    })
  }
}
