import axios from 'axios'
import * as crypto from 'crypto'
import { blockchain } from '../../config'
import { Profile, User } from '@generated/type-graphql'
import { prisma } from '../../services/prisma'
import { GraphQLError } from 'graphql'
import { UserType } from '.prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { uploadFileToS3Bucket } from '../../services/S3'
import { BadgeTypeCreateInput, Currency, Category } from '@generated/type-graphql'
import { FileUpload } from '../../types/fileUpload'
import { PublishBadgeTypeInput } from './types/publishBadgeType.type'

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
  image,
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

const uploadBadgeImg = async (fileData: FileUpload) => {
  const { base64DataURL, mimeType } = fileData

  if (!['image/jpeg', 'image/png', 'image/gif'].includes(mimeType)) {
    throw new GraphQLError('Only JPEG, PNG, GIF file allowed.')
  }

  const fileExtension = mimeType.split('/')[1]
  const id = `badges/${uuidv4()}.${fileExtension}`

  const buffer = Buffer.from(base64DataURL, 'base64')

  const imageHash = crypto.createHash('md5').update(buffer).digest('base64')

  await uploadFileToS3Bucket({
    Key: id,
    ContentType: mimeType,
    buffer,
    hash: imageHash,
  })

  return { imageHash, imageId: id }
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

  // todo: add more userfriendly error handling
  const { imageHash, imageId } = await uploadBadgeImg(fileData)

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
      image: imageId,
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
