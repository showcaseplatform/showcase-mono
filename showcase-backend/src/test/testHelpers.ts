import { Category, Currency, PrismaClient } from '@prisma/client'
import { Uid } from '../types/user'
import { prismaMock } from './prismaMock'

const getRandomNum = () => {
  return Math.floor(Math.random() * 899999 + 100000)
}

export const mockFindUniqueUser = (id: Uid) => prismaMock.user.findUnique.mockResolvedValue({
  id,
  isBanned: false,
  phone: `3670978${getRandomNum()}`,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const mockCreateLikeBadgeType = (badgeTypeId: string, profileId: Uid) => prismaMock.likeBadgeType.create.mockResolvedValue({
  profileId,
  badgeTypeId,
  createdAt: new Date(),
})

export const mockCreateLikeBadge = (badgeItemId: string, profileId: Uid) => prismaMock.likeBadge.create.mockResolvedValue({
  profileId,
  badgeItemId,
  createdAt: new Date(),
})
