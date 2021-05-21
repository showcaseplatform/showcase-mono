/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { blockchain } from '../../config'
import { sendNotificationToFollowersAboutNewBadge } from '../pushNotifications/newBadgePublished'
import { Profile } from '@generated/type-graphql'
import Boom from 'boom'
import { prisma } from '../../services/prisma'
import { PublishBadgeTypeInput } from '../../resolvers/types/publishBadgeTypeInput'
import { User } from '.prisma/client'

interface InputWithUser extends PublishBadgeTypeInput {
  profile: Profile
}

// todo: does user musst have a crypto account?
const validateInputs = async ({ profile, donationAmount, causeId }: Partial<InputWithUser>) => {
  if (!profile || !profile.isCreator) {
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
    creatoraddress: profile?.cryptoWallet?.address,

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
  const { id } = user
  const profile = await prisma.profile.findUnique({
    where: {
      id,
    },
  })

  if (!profile) {
    throw Boom.badData('Invalid user')
  }

  await validateInputs({ ...input, profile })

  const tokenTypeBlockhainId = await createTokenTypeOnBlockchain({ ...input })

  const badgeType = await prisma.badgeType.create({
    data: {
      ...input,
      uri: 'https://showcase.to/badge/' + input.id,
      creatorProfileId: user.id,
      currency: profile?.currency,
      tokenTypeBlockhainId,
    },
  })

  // todo: uncomment this after badgeType creation is tested
  // await sendNotificationToFollowersAboutNewBadge(user.id)

  return badgeType
}
