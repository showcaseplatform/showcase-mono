import 'reflect-metadata'
import prisma from '../../../services/prisma'
import { createTestDb } from '../../../database/createDb'
import { purchaseBadge, PurchaseErrorMessages } from '../purchaseBadge'
import { PurchaseBadgeInput } from '../types/purchaseBadge.type'
import { AuthLib } from '../../auth/authLib'
import { getRandomNum } from '../../../utils/randoms'

beforeAll(async () => {
  return await createTestDb(prisma)
})

describe('Purchasing a badge', () => {
  it('should fail if buyer doesnt have neccesary payment information', async () => {
    const dummyPhone = `3670978${getRandomNum()}`
    const newUser = await AuthLib.createNewUser(dummyPhone, '36')
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter(b => b.supply > b.sold)[0]

    const inputBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: badgeTypeToPurchase.id,
    }

    const inputUserId = newUser.id

    let error = ''
    try {
      await purchaseBadge(inputBadgeTypeId, inputUserId)
    } catch (e) {
       error = e.message
    }

    expect(error).toEqual(PurchaseErrorMessages.paymentInfoMissing)

  })

  it('should fail if buyer already owned a badgItem from the desired badgeType', async () => {
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter(b => b.supply > b.sold)[0]

    const testBadgeItemWithTypeAndOwner = await prisma.badgeItem.findFirst({where: {
      badgeTypeId: {
        equals: badgeTypeToPurchase.id
      }
    }})

    const inputBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: testBadgeItemWithTypeAndOwner?.badgeTypeId || '',
    }

    const inputUserId = testBadgeItemWithTypeAndOwner?.ownerId || ''

    let error = ''
    try {
      await purchaseBadge(inputBadgeTypeId, inputUserId)
    } catch (e) {
       error = e.message
    }

    expect(error).toEqual(PurchaseErrorMessages.badgeAlreadyOwned)
  })

  it('should fail if badgeType is sold-out', async () => {
    const badgeTypes = await prisma.badgeType.findMany()
    const soldoutBadgeType = badgeTypes.filter(b => b.supply === b.sold)[0]
    const testUser = await prisma.user.findFirst({where: {
      badgeItemsOwned: {
        none: {
          badgeTypeId: {
            equals: soldoutBadgeType.id
          }
        }
      }
    }})

    const inputBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: soldoutBadgeType?.id || '',
    }

    let error = ''
    try {
      await purchaseBadge(inputBadgeTypeId, testUser?.id || '')
    } catch (e) {
       error = e.message
    }

    expect(error).toEqual(PurchaseErrorMessages.outOfStock)
  })


  // it('should fail if buyer reached its spending limit and badge is sold for money', async () => {
    
  // })

  // it('should fail if buyer is the creator of the desired badge', async () => {

  // })

  // todo: test currency conversion once we add this feature
})
