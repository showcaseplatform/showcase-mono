import { UserType, User, Currency, Profile } from '@prisma/client'
import { Uid } from '../types/user'
import { getRandomNum } from '../utils/randoms'
import { prismaMock } from './prismaMock'

const userBaseProps: User = {
  id: `${getRandomNum()}`,
  phone: `3670978${getRandomNum()}`,
  userType: UserType.basic,
  isBanned: false,
  kycVerified: false,
  notificationToken: `${getRandomNum()}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const profileBaseProps: Profile = {
  id: `${getRandomNum()}`,
  displayName: `Test Name`,
  username: `Test Username`,
  bio: `Test bio`,
  email: `test@test.to`,
  avatarId: `test-1.jpg`,
  currency: Currency.USD,
  birthDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const getDefaultUser = (id: Uid, userType?: UserType): User => {
  return {
    ...userBaseProps,
    id,
    userType: userType || UserType.basic,
  }
}

export const mockFindUniqueUser = (id: Uid, userType?: UserType) =>
  prismaMock.user.findUnique.mockResolvedValue({
    ...userBaseProps,
    id,
    userType: userType || UserType.basic,
  })

export const mockCreateUser = (phone: string, userType?: UserType) =>
  prismaMock.user.create.mockResolvedValue({
    ...userBaseProps,
    phone,
    userType: userType || UserType.basic,
  })
export const mockUpdateUser = (id: string, userType?: UserType) =>
  prismaMock.user.update.mockResolvedValue({
    ...userBaseProps,
    id,
    userType: userType || UserType.basic,
  })

export const mockFindUniqueProfile = (id: Uid) =>
  prismaMock.profile.findUnique.mockResolvedValue({
    ...profileBaseProps,
    id,
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
