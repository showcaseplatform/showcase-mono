import prisma from '../../services/prisma'
import { AddPaymentInfoInput } from './types/addPaymentInfo.type'
import { User } from '@generated/type-graphql'
// import { GraphQLError } from 'graphql'

export const addPaymentInfo = async (input: AddPaymentInfoInput, user: User): Promise<User> => {
  const { idToken, lastFourCardDigit } = input || {}

  // todo: check user has neccesary information to connect with payment service
  // todo: connect user with payment service provider here

  const paymentInfoToSave = {
    idToken,
    lastFourCardDigit,
  }

  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      paymentInfo: {
        upsert: {
          create: {
            ...paymentInfoToSave,
          },
          update: {
            ...paymentInfoToSave,
          },
        },
      },
    },
  })
}
