/* eslint-disable @typescript-eslint/no-empty-function */
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
  it.only('should fail if buyer doesnt have neccesary payment information', async () => {
    const dummyPhone = `3670978${getRandomNum()}`
    const newUserWithoutPaymentInfo = await AuthLib.createNewUser(dummyPhone, '36')
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter(b => b.supply > b.sold)[0]

    const inputBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: badgeTypeToPurchase.id,
    }

    const inputUserId = newUserWithoutPaymentInfo.id

    let error = ''
    try {
      await purchaseBadge(inputBadgeTypeId, inputUserId)
    } catch (e) {
       error = e.message
    }

    expect(error).toEqual(PurchaseErrorMessages.paymentInfoMissing)

  })

  it('should fail if buyer already owned a badgItem from the desired badgeType', async () => {
    const testBadgeItemWithTypeAndOwner = await prisma.badgeItem.findFirst({include: {
      badgeType: true,
      owner: true
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

  it('should fail is badgeType is sold-out', async () => {})


  it('should fail if buyer reached its spending limit and badge is sold for money', async () => {})

  // todo: test currency conversion once we add this feature
})
