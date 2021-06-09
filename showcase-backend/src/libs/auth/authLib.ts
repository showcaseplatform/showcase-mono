import { Currency, UserType } from '@prisma/client'
import { auth } from 'firebase-admin'
import { EUROPEAN_COUNTRY_CODES } from '../../consts/countryCodes'
import { prisma } from '../../services/prisma'
import { v5 as uuidv5 } from 'uuid'
import { createRandomNames } from '../../utils/createRandomNames'

const UUID_NAMESPAOCE = 'b01abb38-c109-4b71-9136-a2aa73ddde27' // todo: maybe outsource to config

export class AuthLib {
  static isPhoneRegistered = async (phone: string) => {
    try {
      await auth().getUserByPhoneNumber(phone)
      return true
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return false
      }
      throw error
    }
  }

  static getUserByToken = async (token: string) => {
    try {
      if (!token) return null
      const { uid } = await auth().verifyIdToken(token.replace('Bearer ', ''))
      const user = await prisma.user.findUnique({
        where: {
          authId: uid,
        },
      })

      if (user && user.isBanned != true) {
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

  static createNewUser = async ({ phone, areaCode }: { phone: string; areaCode: string }) => {
    const customUserId = uuidv5(phone, UUID_NAMESPAOCE)

    const { uid } = await auth().createUser({
      phoneNumber: phone,
      uid: customUserId,
    })

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
        authId: uid,
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


  static findOrCreateNewUser = async ({ phone, areaCode }: { phone: string; areaCode: string }) => {
    try {
      const { uid } = await auth().getUserByPhoneNumber(phone)
      return { authId: uid, isNewUser: false }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        const { authId } = await AuthLib.createNewUser({ phone, areaCode })

        return { authId, isNewUser: true }
      }
      throw error
    }
  }

  static getCustomToken = async (authId: string) => {
    return await auth().createCustomToken(authId)
  }
}
