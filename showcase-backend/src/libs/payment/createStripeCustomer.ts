import prisma from '../../services/prisma'
import { stripe } from '../../services/stripe'
import { CreateStripeCustomerInput } from './types/createStripeCustomer.type'
import { User } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'

export const createStripeCustomer = async (input: CreateStripeCustomerInput, user: User) => {
  const { stripeToken, lastfour } = input

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!profile || !profile.email || !user.phone) throw new GraphQLError('User profile is missing email or phone')

  const stripeCustomer = await stripe.customers.create({
    metadata: {
      uid: user.id,
      phone: user.phone,
      username: profile.username,
      displayName: profile.displayName,
      email: profile.email,
    },
    source: stripeToken,
    phone: user.phone,
  })

  const stripeDataToSave = {
    stripeId: stripeCustomer.id,
    lastFourCardDigit: lastfour
  }

  console.log('Created stripe customer:', { stripeCustomer })

  await prisma.stripe.upsert({
    where: {
      id: user.id
    },
    create: {
      ...stripeDataToSave,
      userId:  user.id,
    },
    update: {
      ...stripeDataToSave
    }
  })

  return 'Card successfully added and linked with stripe account'
}
