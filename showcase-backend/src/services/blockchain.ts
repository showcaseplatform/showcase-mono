import axios from 'axios'
import { blockchain } from '../config'
import Boom from 'boom'
import { prisma } from './prisma'
import { BadgeItemId } from '../types/badge'
import { ListBadgeForSaleInput } from '../libs/badge/types/listBadgeForSale.type'
import { Uid } from '../types/user'
import { Profile } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { BadgeTypeCreateInput } from '@generated/type-graphql'
import { PublishBadgeTypeInputValidation } from '../libs/badge/publishBadgeType'

export const mintNewBadgeOnBlockchain = async (
  newBadgeTokenId: string,
  cryptoWalletAddress?: string // todo: remove ? once crypto account validation is in place
) => {
  const data = {
    to: cryptoWalletAddress,
    type: newBadgeTokenId,
    token: blockchain.authToken,
  }

  const response = await axios.post(blockchain.server + '/mintBadge', data)

  if (response.data?.success && response.data?.transactionHash) {
    return response.data.transactionHash
  } else {
    throw Boom.internal('Failed to mint new badge on blockchain', response)
  }
}

export const checkBadgeOwnedOnBlockchain = async (badgeItemId: BadgeItemId): Promise<boolean> => {
  const badge = await prisma.badgeItem.findUnique({
    where: {
      id: badgeItemId,
    },
    include: {
      owner: {
        include: {
          cryptoWallet: {
            select: {
              address: true,
            },
          },
        },
      },
    },
  })
  if (!badge) {
    throw Boom.badData('Badge id not found', { badgeItemId })
  }

  const data = {
    badgeid: badgeItemId,
    badgeowner: badge.ownerId,
    token: blockchain.authToken,
  }

  const response = await axios.post(blockchain.server + '/verifyOwnershipOfBadge', data)
  console.log('Blockchain response: ', { response })

  return !!response?.data?.isOwner
}

interface BlockChainPostData {
  sig: string
  message: string
  badgeid: BadgeItemId
  badgeowner: string
  token: string
}

export const addNonFungibleToEscrowWithSignatureRelay = async (
  input: ListBadgeForSaleInput,
  uid: Uid
) => {
  const { sig, message, badgeItemId: tokenId } = input

  const cryptoWallet = await prisma.crypto.findUnique({
    where: {
      id: uid,
    },
  })

  if (!cryptoWallet?.address) {
    throw Boom.badData('User doesnt have crypto address')
  }

  const postData: BlockChainPostData = {
    sig,
    message,
    badgeid: tokenId,
    badgeowner: cryptoWallet.address,
    token: blockchain.authToken,
  }

  const response = await axios.post(
    blockchain.server + '/addNonFungibleToEscrowWithSignatureRelay',
    postData
  )

  if (response && response.data && response.data.success) {
    return
  } else {
    throw new GraphQLError('Blockchain server gave invalid response')
  }
}

export const createTokenTypeOnBlockchain = async ({
  id,
  user,
  profile,
  title,
  description,
  category,
  imageId,
  imageHash,
  supply,
}: Partial<
  PublishBadgeTypeInputValidation & BadgeTypeCreateInput & { profile: Profile }
>): Promise<string> => {
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

export const removeBadgeFromEscrow = async (tokenId: string) => {
  return await axios.post(blockchain.server + '/removeBadgeFromEscrow', { badgeid: tokenId })
}
