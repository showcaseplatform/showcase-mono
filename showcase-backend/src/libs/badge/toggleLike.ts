import { ToggleLikeInput } from './types/toggleLike.type'
import  prisma  from '../../services/prisma'
import { Uid } from '../../types/user'

export const checkIfBadgeAlreadyLiked = async (input: ToggleLikeInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    const like = await prisma.badgeTypeLike.findUnique({
      where: {
        userId_badgeTypeId: {
          userId: uid,
          badgeTypeId: badgeId,
        },
      },
    })
    return !!like
  } else {
    const like = await prisma.badgeItemLike.findUnique({
      where: {
        userId_badgeItemId: {
          badgeItemId: badgeId,
          userId: uid,
        },
      },
    })
    return !!like
  }
}

export const deleteLikeRecord = async (input: ToggleLikeInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    return await prisma.badgeTypeLike.delete({
      where: {
        userId_badgeTypeId: {
          badgeTypeId: badgeId,
          userId: uid,
        },
      },
    })
  } else {
    return await prisma.badgeItemLike.delete({
      where: {
        userId_badgeItemId: {
          badgeItemId: badgeId,
          userId: uid,
        },
      },
    })
  }
}

export const createLikeRecord = async (input: ToggleLikeInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    return await prisma.badgeTypeLike.create({
      data: {
        badgeTypeId: badgeId,
        userId: uid,
      },
    })
  } else {
    return await prisma.badgeItemLike.create({
      data: {
        badgeItemId: badgeId,
        userId: uid,
      },
    })
  }
}

export const toggleLike = async (input: ToggleLikeInput, uid: Uid) => {
  const isLikedAlready = await checkIfBadgeAlreadyLiked(input, uid)
  if (isLikedAlready) {
    // todo: how to deal with unlikes (delete or flag)
    return await deleteLikeRecord(input, uid)
  } else {
    return await createLikeRecord(input, uid)
  }
}
