import prisma from '../../services/prisma'
import { AddPaymentInfoInput } from './types/createStripeCustomer.type'
import { User } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'

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

  await prisma.paymentInfo.upsert({
    where: {
      id: user.id,
    },
    create: {
      ...paymentInfoToSave,
      userId: user.id,
    },
    update: {
      ...paymentInfoToSave,
    },
  })

  return 'Card successfully added and linked with stripe account'
}
