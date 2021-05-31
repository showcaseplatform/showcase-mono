/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { blockchain } from '../../config'
import { sendNotificationToFollowersAboutNewBadge } from '../pushNotifications/newBadgePublished'
import { Profile, User } from '@generated/type-graphql'
import Boom from 'boom'
import { prisma } from '../../services/prisma'
import { PublishBadgeTypeInput } from './types/publishBadgeType.type'


interface InputWithUser extends PublishBadgeTypeInput {
  user: User
  profile: Profile
}

// todo: does user musst have a crypto account?
const validateInputs = async ({ user, donationAmount, causeId }: Partial<InputWithUser>) => {
  if (!user || !user.isCreator) {
    throw Boom.preconditionFailed('You are not a verified creator')
  }

  if (causeId || donationAmount) {
    try {
      if (!donationAmount) throw Boom.badData('Invalid donation amount')
      await prisma.cause.findUnique({
        where: {
          id: causeId,
        },
      })
    } catch (e) {
      Boom.badData('Invalid donation cause', e)
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
    throw Boom.internal('Blockchain error, missing tokenType from response', blockchainData)
  }
}

export const publishBadgeType = async (input: PublishBadgeTypeInput, user: User) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!user || !profile) {
    throw Boom.badData('Invalid user')
  }

  await validateInputs({ ...input, user })

  const tokenTypeBlockhainId = await createTokenTypeOnBlockchain({ ...input, profile, user })

  const badgeType = await prisma.badgeType.create({
    data: {
      ...input,
      uri: 'https://showcase.to/badge/' + input.id,
      creatorId: user.id,
      currency: profile?.currency,
      tokenTypeBlockhainId,
    },
  })

  // todo: uncomment this after badgeType creation is tested
  // await sendNotificationToFollowersAboutNewBadge(user.id)

  return badgeType
}
