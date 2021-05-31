import { Category, Currency, PrismaClient } from '@prisma/client'
import { Uid } from '../types/user'
import { prismaMock } from './prismaMock'

const getRandomNum = () => {
  return Math.floor(Math.random() * 899999 + 100000)
}

export const mockFindUniqueUser = (id: Uid) => prismaMock.user.findUnique.mockResolvedValue({
  id,
  isBanned: false,
  isCreator: false,
  kycVerified: false,
  authId: `${getRandomNum()}`,
  phone: `3670978${getRandomNum()}`,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const mockCreateLikeBadgeType = (badgeTypeId: string, userId: Uid) => prismaMock.badgeTypeLike.create.mockResolvedValue({
  userId,
  badgeTypeId,
  createdAt: new Date(),
})

export const mockCreateLikeBadge = (badgeItemId: string, userId: Uid) => prismaMock.badgeItemLike.create.mockResolvedValue({
  userId,
  badgeItemId,
  createdAt: new Date(),
})
