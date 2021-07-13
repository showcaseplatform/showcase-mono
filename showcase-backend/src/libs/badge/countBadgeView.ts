import { blockchain } from '../../config'
import { Uid } from '../../types/user'
import prisma from '../../services/prisma'
import { CountViewInput, ViewInfo } from './types/countView.type'
import { BadgeItemId } from '../../types/badge'
import { checkBadgeOwnedOnBlockchain } from '../../services/blockchain'

export const checkIfBadgeAlreadyViewed = async (input: CountViewInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    const view = await prisma.badgeTypeView.findUnique({
      where: {
        userId_badgeTypeId: {
          userId: uid,
          badgeTypeId: badgeId,
        },
      },
    })
    return !!view
  } else {
    const view = await prisma.badgeItemView.findUnique({
      where: {
        userId_badgeItemId: {
          badgeItemId: badgeId,
          userId: uid,
        },
      },
    })
    return !!view
  }
}

const createViewRecord = async (input: CountViewInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    return await prisma.badgeTypeView.create({
      data: {
        badgeTypeId: badgeId,
        userId: uid,
      },
    })
  } else {
    return await prisma.badgeItemView.create({
      data: {
        badgeItemId: badgeId,
        userId: uid,
      },
    })
  }
}

const removeBadgeFromShowCase = async ({
  badgeItemId,
  uid,
}: {
  badgeItemId: BadgeItemId
  uid: Uid
}) => {
  await prisma.user.update({
    where: {
      id: uid,
    },
    data: {
      isBanned: true,
    },
  })

  await prisma.badgeItem.update({
    where: {
      id: badgeItemId,
    },
    data: {
      removedFromShowcase: true,
    },
  })

  console.log(`❗❗❗ Badge removed from showcase: `, { badgeItemId }, { uid })
}

const randomBadgeInspection = (marketplace: boolean): boolean => {
  if (marketplace) {
    return false
  }

  const min = Math.ceil(1)
  const max = Math.floor(51)
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min

  return randomNum === 51
}

export const countView = async (input: CountViewInput, uid: Uid) => {
  const { badgeId, marketplace } = input

  // todo: remove blockchain.enabled once server is ready
  if (blockchain.enabled && randomBadgeInspection(marketplace)) {
    console.log('👁️‍🗨️ Random badge inspection triggered 👁️‍🗨️')
    const isOwner = await checkBadgeOwnedOnBlockchain(badgeId)
    !isOwner && (await removeBadgeFromShowCase({ badgeItemId: badgeId, uid }))
  }

  const isAlreadyViewed = await checkIfBadgeAlreadyViewed(input, uid)
  if (!isAlreadyViewed) {
    return await createViewRecord(input, uid)
  } else {
    return { info: 'Already viewed' } as ViewInfo
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
