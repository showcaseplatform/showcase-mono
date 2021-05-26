import { blockchain } from '../../config'
import axios from 'axios'
import { Uid } from '../../types/user'
import Boom from 'boom'
import prisma from '../../services/prisma'
import { CountViewInput, ViewInfo } from '../../resolvers/types/countViewInput'
import { BadgeId } from '../../types/badge'

const checkIfBadgeAlreadyViewed = async (input: CountViewInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    const view = await prisma.viewBadgeType.findUnique({
      where: {
        profileId_badgeTypeId: {
          profileId: uid,
          badgeTypeId: badgeId,
        },
      },
    })
    return !!view
  } else {
    const view = await prisma.viewBadge.findUnique({
      where: {
        profileId_badgeId: {
          badgeId,
          profileId: uid,
        },
      },
    })
    return !!view
  }
}

const createViewRecord = async (input: CountViewInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    return await prisma.viewBadgeType.create({
      data: {
        badgeTypeId: badgeId,
        profileId: uid,
      },
    })
  } else {
    return await prisma.viewBadge.create({
      data: {
        badgeId: badgeId,
        profileId: uid,
      },
    })
  }
}

const removeBadgeFromShowCase = async ({ badgeId, uid }: { badgeId: BadgeId; uid: Uid }) => {
  await prisma.user.update({
    where: {
      id: uid,
    },
    data: {
      isBanned: true,
    },
  })

  await prisma.badge.update({
    where: {
      id: badgeId,
    },
    data: {
      removedFromShowcase: true,
    },
  })

  console.log(`❗❗❗ Badge removed from showcase: `, { badgeId }, { uid })
}

const checkBadgeOwnedOnBlockchain = async (badgeId: BadgeId): Promise<boolean> => {
  const badge = await prisma.badge.findUnique({
    where: {
      id: badgeId,
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
    throw Boom.badData('Badge id not found', { badgeId })
  }

  const data = {
    badgeid: badgeId,
    badgeowner: badge.ownerProfileId,
    token: blockchain.authToken,
  }

  const response = await axios.post(blockchain.server + '/verifyOwnershipOfBadge', data)
  console.log('Blockchain response: ', { response })

  return !!response?.data?.isOwner
}

const randomBadgeInspection = (marketplace: boolean): boolean => {
  if (marketplace) return false

  let min = Math.ceil(1)
  let max = Math.floor(51)
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min

  return randomNum === 51
}

export const countView = async (input: CountViewInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (randomBadgeInspection(marketplace)) {
    console.log('👁️‍🗨️ Random badge inspection triggered 👁️‍🗨️')
    const isOwner = await checkBadgeOwnedOnBlockchain(badgeId)
    !isOwner && (await removeBadgeFromShowCase({badgeId, uid}))
  }

  const isAlreadyViewed = await checkIfBadgeAlreadyViewed(input, uid)
  if (!isAlreadyViewed) {
    return await createViewRecord(input, uid)
  } else {
    return { info: "Already viewed"} as ViewInfo
  }
}

// todo: why is this commented out, are these valid endpoint for something?
/*axios.post(blockchain.server+'/getMetadataOfBadge', {badgetype:"57896044618658097711785492504343953941267134110420635948653900123522597912576", token:  blockchain.authToken})
        .then(async (response) => {
            console.log("METADATA", response.data);
            return true;
        }).catch((e)=>{
            console.log("error verifying badge ownership", e)
            return true;
        })

        axios.post(blockchain.server+'/getOwnershipOfBadge', {badgeid, token:  blockchain.authToken})
        .then(async (response) => {
            console.log("current owner is:", response.data);
            return true;
        }).catch((e)=>{
            console.log("error verifying badge ownership", e)
            return true;
        })


        axios.post(blockchain.server+'/verifyBadgeInEscrow', {badgeid, token:  blockchain.authToken})
        .then(async (response) => {
            console.log("escrow is:", response.data);
            return true;
        }).catch((e)=>{
            console.log("error verifying badge escrow", e)
            return true;
        })
*/
