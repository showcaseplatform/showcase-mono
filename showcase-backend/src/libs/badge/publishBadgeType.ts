/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { blockchain } from '../../config'
import { sendNotificationToFollowersAboutNewBadge } from '../pushNotifications/newBadgePublished'
import { Profile, User } from '@generated/type-graphql'
import { prisma } from '../../services/prisma'
import { PublishBadgeTypeInput } from './types/publishBadgeType.type'
import { GraphQLError } from 'graphql'
import { UserType } from '.prisma/client'

interface InputWithUser extends PublishBadgeTypeInput {
  user: User
  profile: Profile
}

// todo: does user musst have a crypto account?
const validateInputs = async ({ user, donationAmount, causeId }: Partial<InputWithUser>) => {
  if (!user || user.userType != UserType.creator) {
    throw new GraphQLError('You are not a verified creator')
  }

  if (causeId || donationAmount) {
    try {
      if (!donationAmount) throw new GraphQLError('Invalid donation amount')
      await prisma.cause.findUnique({
        where: {
          id: causeId,
        },
      })
    } catch (e) {
      throw new GraphQLError('Invalid donation cause', e)
    }
  }
}

const createTokenTypeOnBlockchain = async ({
  id,
  user,
  profile,
  title,
  description,
  category,
  image,
  imageHash,
  supply,
}: Partial<InputWithUser>): Promise<string> => {
  const data = {
    token: blockchain.authToken,
    uri: 'https://showcase.to/badge/' + id,
    name: title,
    description: description || 'None',
    creatorname: profile?.username,
    category,
    image,
    imagehash: imageHash, // todo: camelCase on blockchain server
    supply,
    creatoraddress: user?.cryptoWallet?.address,

    // todo: why are these commented out?
    //causeSite: foundDonationSite,
    //causeAmount: foundDonationAmount,
  }

  const { data: blockchainData } = await axios.post(blockchain.server + '/createBadge', data)

  if (blockchainData.tokenType) {
    return blockchainData.tokenType
  } else {
    throw new GraphQLError('Blockchain error, missing tokenType from response', blockchainData)
  }
}

export const publishBadgeType = async (input: PublishBadgeTypeInput, user: User) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!user || !profile) {
    throw new GraphQLError('Invalid user')
  }

  await validateInputs({ ...input, user })

  // todo: remove blockchain.enabled once server is ready
  const tokenTypeId = blockchain.enabled
    ? await createTokenTypeOnBlockchain({ ...input, profile, user })
    : input.id

  const badgeType = await prisma.badgeType.create({
    data: {
      ...input,
      uri: 'https://showcase.to/badge/' + input.id,
      creatorId: user.id,
      currency: input.currency || profile.currency,
      tokenTypeId,
    },
  })

  // todo: uncomment this after badgeType creation is tested
  // await sendNotificationToFollowersAboutNewBadge(user.id)

  return badgeType
}
