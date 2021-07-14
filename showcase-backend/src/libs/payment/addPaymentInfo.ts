import prisma from '../../services/prisma'
import { AddPaymentInfoInput } from './types/addPaymentInfo.type'
import { User } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'
import { UserType } from '@prisma/client'

export const addPaymentInfo = async (input: AddPaymentInfoInput, user: User): Promise<User> => {
  const { idToken, lastFourCardDigit } = input || {}

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!profile || !profile.email || !user.phone) {
    throw new GraphQLError('User profile is missing email or phone')
  }

  // todo: connect user with payment service provider here
  // const stripeCustomer = await stripe.customers.create({
  //   metadata: {
  //     uid: user.id,
  //     phone: user.phone,
  //     username: profile.username,
  //     displayName: profile.displayName,
  //     email: profile.email,
  //   },
  //   source: idToken,
  //   phone: user.phone,
  // })

  const paymentInfoToSave = {
    idToken,
    lastFourCardDigit,
  }

  const updatedUserType =
    user.userType == UserType.basic ? { userType: UserType.collector } : undefined

  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...updatedUserType,
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
