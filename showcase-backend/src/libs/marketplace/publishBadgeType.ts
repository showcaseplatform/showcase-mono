/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { blockchain } from '../../config'
import { sendNotificationToFollowersAboutNewBadge } from '../pushNotifications/newBadgePublished'
import { PublishBadgeTypeInput } from '../../resolvers/marketplaceResolver'
import { Profile } from '@generated/type-graphql'
import Boom from 'boom'
import { prisma } from '../../services/prisma'

interface Input extends PublishBadgeTypeInput {
  user: Profile
}

// todo: maybe not all of these are neccesary, because resolvers validates these input already
// todo: does user musst have a crypto account?
const validateInputs = async ({
  user,
  title,
  price,
  supply,
  image,
  description,
  donationAmount,
  causeId,
}: Input) => {
  if (!user) {
    throw Boom.badData('Invalid user')
  }
  if (!user.isCreator) {
    throw Boom.preconditionFailed('You are not a verified creator')
  }

  if (title.length > 20 || title.length === 0) {
    throw Boom.preconditionFailed('Invalid title length')
  } else if (price < 0 || price > 200 || isNaN(price) || typeof price !== 'number') {
    throw Boom.preconditionFailed('Invalid Price')
  } else if (supply < 1 || supply > 1000000 || isNaN(supply) || typeof supply !== 'number') {
    throw Boom.preconditionFailed('Invalid quantity')
  } else if (!image || image.length === 0) {
    throw Boom.preconditionFailed('Invalid image')
  } else if (description && description.length > 240) {
    throw Boom.preconditionFailed('Invalid description')
  } else if (donationAmount && (donationAmount < 0.05 || donationAmount > 0.5)) {
    throw Boom.preconditionFailed('Invalid donation amount')
  } else if (causeId) {
    try {
      await prisma.cause.findUnique({
        where: {
          id: causeId,
        },
      })
    } catch (e) {
      Boom.preconditionFailed('Invalid donation cause', e)
    }
  }
}

const createTokenTypeOnBlockchain = async ({
  id,
  user,
  title,
  description,
  category,
  image,
  imageHash,
  supply,
}: Partial<Input> & { id: string }): Promise<string> => {
  const data = {
    token: blockchain.authToken,
    uri: 'https://showcase.to/badge/' + id,
    name: title,
    description: description || 'None',
    creatorname: user?.username,
    category,
    image,
    imagehash: imageHash, // todo: camelCase on blockchain server
    supply,
    creatoraddress: user?.crypto?.address,

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

export const publishBadgeType = async (input: PublishBadgeTypeInput, user: Profile) => {
  await validateInputs({ ...input, user })

  const tokenTypeBlockhainId = await createTokenTypeOnBlockchain({ ...input })

  const badgeType = await prisma.badgeType.create({
    data: {
      ...input,
      uri: 'https://showcase.to/badge/' + input.id,
      creatorProfileId: user.id,
      currency: user.currency,
      tokenTypeBlockhainId,
      sold: 0,
      views: 0,
      likes: 0,
      shares: 0,
      soldout: false,
      forSale: false,
      removedFromShowcase: false,
    },
  })

  // todo: uncomment this after badgeType creation is tested
  // await sendNotificationToFollowersAboutNewBadge(user.id)

  return badgeType
}
