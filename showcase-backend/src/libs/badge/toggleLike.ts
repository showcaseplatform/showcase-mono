import { ToggleLikeInput } from '../../resolvers/types/toggleLikeInput'
import  prisma  from '../../services/prisma'
import { Uid } from '../../types/user'

export const checkIfBadgeAlreadyLiked = async (input: ToggleLikeInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    const like = await prisma.likeBadgeType.findUnique({
      where: {
        profileId_badgeTypeId: {
          profileId: uid,
          badgeTypeId: badgeId,
        },
      },
    })
    return !!like
  } else {
    const like = await prisma.likeBadge.findUnique({
      where: {
        profileId_badgeItemId: {
          badgeItemId: badgeId,
          profileId: uid,
        },
      },
    })
    return !!like
  }
}

export const deleteLikeRecord = async (input: ToggleLikeInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    return await prisma.likeBadgeType.delete({
      where: {
        profileId_badgeTypeId: {
          badgeTypeId: badgeId,
          profileId: uid,
        },
      },
    })
  } else {
    return await prisma.likeBadge.delete({
      where: {
        profileId_badgeItemId: {
          badgeItemId: badgeId,
          profileId: uid,
        },
      },
    })
  }
}

export const createLikeRecord = async (input: ToggleLikeInput, uid: Uid) => {
  const { badgeId, marketplace } = input
  if (marketplace) {
    return await prisma.likeBadgeType.create({
      data: {
        badgeTypeId: badgeId,
        profileId: uid,
      },
    })
  } else {
    return await prisma.likeBadge.create({
      data: {
        badgeItemId: badgeId,
        profileId: uid,
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
