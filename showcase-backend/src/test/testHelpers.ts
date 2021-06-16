import { UserType } from '@prisma/client'
import { Uid } from '../types/user'
import { getRandomNum } from '../utils/randoms'
import { prismaMock } from './prismaMock'

export const mockFindUniqueUser = (id: Uid) =>
  prismaMock.user.findUnique.mockResolvedValue({
    id,
    isBanned: false,
    userType: UserType.basic,
    kycVerified: false,
    phone: `3670978${getRandomNum()}`,
    notificationToken: `${getRandomNum()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

export const mockCreateBadgeTypeLike = (badgeTypeId: string, userId: Uid) =>
  prismaMock.badgeTypeLike.create.mockResolvedValue({
    userId,
    badgeTypeId,
    createdAt: new Date(),
  })

export const mockCreateBadgeItemLike = (badgeItemId: string, userId: Uid) =>
  prismaMock.badgeItemLike.create.mockResolvedValue({
    userId,
    badgeItemId,
    createdAt: new Date(),
  })

export const mockUser = (phoneNumber: string) =>
  prismaMock.user.create.mockResolvedValue({
    id: `${getRandomNum()}`,
    phone: phoneNumber,
    userType: UserType.basic,
    isBanned: false,
    kycVerified: false,
    notificationToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
