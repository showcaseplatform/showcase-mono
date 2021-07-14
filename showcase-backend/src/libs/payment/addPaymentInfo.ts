import prisma from '../../services/prisma'
import { AddPaymentInfoInput } from './types/addPaymentInfo.type'
import { User } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'
import { UserType } from '@prisma/client'

export const addPaymentInfo = async (input: AddPaymentInfoInput, user: User) => {
  const { idToken, lastfour } = input

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
    lastFourCardDigit: lastfour,
  }

  const updatedUserType = user.userType == UserType.basic ? {userType: UserType.collector} : undefined

  await prisma.user.update({
    where: {
      id: user.id
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
        }
      }
    }
  })

  return 'Card successfully added and linked with stripe account'
}
