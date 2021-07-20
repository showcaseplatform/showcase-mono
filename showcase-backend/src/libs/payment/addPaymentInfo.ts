import prisma from '../../services/prisma'
import { AddPaymentInfoInput } from './types/addPaymentInfo.type'
import { User } from '@generated/type-graphql'
// import { GraphQLError } from 'graphql'

export const addPaymentInfo = async (input: AddPaymentInfoInput, user: User): Promise<User> => {
  const { idToken, lastFourCardDigit } = input || {}

  // todo: check user has neccesary information to connect with payment service
  // const profile = await prisma.profile.findUnique({
  //   where: {
  //     id: user.id,
  //   },
  // })

  // if (!profile || !profile.email || !user.phone) {
  //   throw new GraphQLError('User profile is missing email or phone')
  // }

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
