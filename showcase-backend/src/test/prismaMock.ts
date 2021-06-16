import { jest } from '@jest/globals'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, MockProxy } from 'jest-mock-extended'

import prisma from '../services/prisma'

// todo: ReferenceError: jest is not defined
jest.mock('../services/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as MockProxy<PrismaClient>
