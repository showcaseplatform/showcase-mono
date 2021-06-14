import { Currency, UserType } from '@prisma/client'
import { EUROPEAN_COUNTRY_CODES } from '../../consts/countryCodes'
import { prisma } from '../../services/prisma'
import { createRandomNames } from '../../utils/createRandomNames'
import { jwtClient } from '../../services/jsonWebToken'
import { findUserByPhone } from '../database/user.repo'
export class AuthLib {
  static getUserByToken = async (token: string) => {
    try {
      if (!token) return null

      const { phone } = jwtClient.verifyToken(token.replace('Bearer ', ''))

      const user = await findUserByPhone(phone)

      if (user && user.isBanned != true) {
        return user
      } else {
        return null
      }
    } catch (error) {
      console.error('Cannot get user by token: ', { token }, { error })
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
    } else if (EUROPEAN_COUNTRY_CODES.indexOf(areaCode + '') > -1) {
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
        balance: {},
      },
    })
  }
}
