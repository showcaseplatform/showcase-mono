import axios from 'axios'
import { blockchain } from '../../config'
import { Profile, User } from '@generated/type-graphql'
import { prisma } from '../../services/prisma'
import { GraphQLError } from 'graphql'
import { UserType } from '.prisma/client'
import { BadgeTypeCreateInput, Currency, Category } from '@generated/type-graphql'
import { FileUpload } from '../../types/fileUpload'
import { PublishBadgeTypeInput } from './types/publishBadgeType.type'
import { FileType, uploadFile } from '../../utils/fileUpload'

interface InputWithUser {
  user: User
  donationAmount: number
  causeId: number
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
  imageId,
  imageHash,
  supply,
}: Partial<InputWithUser & BadgeTypeCreateInput & { profile: Profile }>): Promise<string> => {
  const data = {
    token: blockchain.authToken,
    uri: 'https://showcase.to/badge/' + id,
    name: title,
    description: description || 'None',
    creatorname: profile?.username,
    category,
    image: imageId,
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

export const publishBadgeType = async (
  input: PublishBadgeTypeInput,
  fileData: FileUpload,
  user: User
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!user || !profile) {
    throw new GraphQLError('Invalid user')
  }

  await validateInputs({
    ...input,
    user,
  })

  // todo: add more userfriendly error handling & upload progress follow
  const { hash: imageHash, Key: imageId, gif } = await uploadFile({ fileData, fileType: FileType.badge })

  // todo: remove blockchain.enabled once server is ready
  const tokenTypeId = blockchain.enabled
    ? await createTokenTypeOnBlockchain({
        ...input,
        currency: input.currency as Currency,
        category: input.category as Category,
        profile,
        user,
      })
    : imageId

  const { causeId, ...restData } = input

  const badgeType = await prisma.badgeType.create({
    data: {
      ...restData,
      imageHash,
      imageId,
      gif,
      uri: 'https://showcase.to/badge/' + imageId, // todo: check if its ok on showcase.to that imageId includes full path of img (badges/xyz123..)
      creator: { connect: { id: user.id } },
      currency: profile.currency,
      tokenTypeId,
      cause: causeId ? { connect: { id: causeId } } : undefined,
    },
  })

  // todo: uncomment this after badgeType creation is tested
  // await sendNotificationToFollowersAboutNewBadge(user.id)

  return badgeType
}
