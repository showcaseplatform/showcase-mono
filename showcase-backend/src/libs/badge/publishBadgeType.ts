/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { v4 } from 'uuid'
import * as crypto from 'crypto'
import { blockchain } from '../../config'
import { Profile, User } from '@generated/type-graphql'
import { prisma } from '../../services/prisma'
import { GraphQLError } from 'graphql'
import { UserType } from '.prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { uploadFile } from '../../services/S3'
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

export const publishBadgeType = async (
  input: PublishBadgeTypeInput,
  imageHash: string,
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

  const imageId = v4()

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
      id: imageId,
      imageHash,
      image: '',
      uri: 'https://showcase.to/badge/' + imageId,
      creator: { connect: { ...user, phone: user.phone || undefined } },
      currency: input.currency || profile.currency,
      tokenTypeId,
      cause: { connect: { id: causeId } },
    },
  })

  // todo: uncomment this after badgeType creation is tested
  // await sendNotificationToFollowersAboutNewBadge(user.id)

  return badgeType
}

// todo: atm upload service handling bucketName
// todo: key should have proper file type like: *.png
export const uploadBadge = async (fileData: FileUpload) => {
  const { base64DataURL, mimeType } = fileData

  if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
    throw new GraphQLError('Only JPEG and PNG file allowed.')
  }

  const id = uuidv4()
  const fileExtension = mimeType.split('/')[1]
  const S3_key = `${id}.${fileExtension}`

  const hash = crypto.createHash('sha256').update(base64DataURL).digest('base64')

  const uploadedFile = await uploadFile({
    Key: S3_key,
    buffer: Buffer.from(base64DataURL, 'base64'),
  })

  return { hash, uploadedFile }
}
