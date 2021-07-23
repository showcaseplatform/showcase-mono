import { blockchain } from '../../config'
// import { sendNotificationToFollowersAboutNewBadge } from '../pushNotifications/newBadgePublished'
import { prisma } from '../../services/prisma'
import { GraphQLError } from 'graphql'
import { UserType } from '.prisma/client'
import { Currency, Category, User } from '@generated/type-graphql'
import { FileType, FileUpload } from '../../utils/types/fileUpload.type'
import { PublishBadgeTypeInput } from './types/publishBadgeType.type'
import { uploadFile } from '../../utils/fileUpload'
import { BadgeType } from '@prisma/client'
import { createTokenTypeOnBlockchain } from '../../services/blockchain'

export interface PublishBadgeTypeInputValidation {
  user: User
  donationAmount: number
  causeId: number
}

// todo: does user musst have a crypto account?
const validatePublishBadgeTypeInputs = async ({ user, donationAmount, causeId }: Partial<PublishBadgeTypeInputValidation>) => {
  if (!user || user.userType !== UserType.creator) {
    throw new GraphQLError('You are not a verified creator')
  }

  if (causeId || donationAmount) {
    try {
      if (!donationAmount) {
        throw new GraphQLError('Invalid donation amount')
      }
      await prisma.cause.findUnique({
        where: {
          id: causeId,
        },
      })
    } catch (e) {
      throw new GraphQLError(`Invalid donation cause: ${(e as Error).message}`)
    }
  }
}

export const publishBadgeType = async (
  input: PublishBadgeTypeInput,
  fileData: FileUpload,
  user: User
): Promise<BadgeType> => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!user || !profile) {
    throw new GraphQLError('Invalid user')
  }

  await validatePublishBadgeTypeInputs({
    ...input,
    user,
  })

  // todo: add more userfriendly error handling & upload progress follow
  const {
    hash: imageHash,
    Key: imageId,
    gif,
  } = await uploadFile({ fileData, fileType: FileType.badge })

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
