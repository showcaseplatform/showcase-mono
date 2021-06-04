import prisma from '../../services/prisma'
import { stripe } from '../../services/stripe'
import { AddCardInput } from './types/addCard.type'
import { User } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'

export const addCard = async (input: AddCardInput, user: User) => {
  const { stripeToken, lastfour } = input
  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })
  if (!profile || !profile.email) throw new GraphQLError('User profile is missing email')

  const stripeCustomer = await stripe.customers.create({
    source: stripeToken,
    metadata: {
      uid: user.id,
      phone: user.phone,
      username: profile.username,
      displayName: profile.displayName,
      email: profile.email,
    },
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
      id:  user.id,
    },
    update: {
      ...stripeDataToSave
    }
  })

  return 'Card successfully added and linked with stripe account'
}
