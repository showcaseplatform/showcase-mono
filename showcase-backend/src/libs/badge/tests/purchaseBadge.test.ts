import 'reflect-metadata'
import prisma from '../../../services/prisma'
import { createTestDb } from '../../../database/createDb'
import { purchaseBadge, PurchaseErrorMessages } from '../purchaseBadge'
import { PurchaseBadgeInput } from '../types/purchaseBadge.type'
import { AuthLib } from '../../auth/authLib'
import { getRandomNum } from '../../../utils/randoms'
import { Cause, UserType } from '@prisma/client'
import { SHOWCASE_COMMISSION_FEE_MULTIPLIER } from '../../../consts/businessRules'

beforeAll(async () => {
  return await createTestDb(prisma)
})

describe('Purchasing a badge', () => {
  it('should update badgeType, creator balance, cause and create new badgeItem, receipt on success', async () => {
    const badgeTypes = await prisma.badgeType.findMany({
      include: { cause: true, creator: { include: { balance: true } } },
    })
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]
    const cause = badgeTypeToPurchase?.cause

    const creatorWithBalance = badgeTypeToPurchase.creator
    const inputBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: badgeTypeToPurchase.id,
    }

    const testUser = await prisma.user.findFirst({
      where: {
        badgeItemsOwned: {
          none: {
            badgeTypeId: {
              equals: badgeTypeToPurchase.id,
            },
          },
        },
        userType: {
          not: UserType.creator,
        },
      },
    })

    const purchasedBadgeItem = await purchaseBadge(inputBadgeTypeId, testUser?.id || '')

    const badgeTypeAfterPurchase = await prisma.badgeType.findUnique({
      where: {
        id: badgeTypeToPurchase.id,
      },
    })

    const receipt = await prisma.receipt.findUnique({
      where: {
        badgeItemId: purchasedBadgeItem.id,
      },
    })

    const creatorAfterPurchase = await prisma.user.findUnique({
      where: {
        id: badgeTypeToPurchase.creatorId,
      },
      include: {
        balance: true,
      },
    })

    const causeAfterPurchase = cause
      ? await prisma.cause.findUnique({
          where: {
            id: cause.id,
          },
        })
      : null

    const balanceBeforePurchase = creatorWithBalance?.balance?.[badgeTypeToPurchase?.currency] || 0
    const balanceAfterPurchase = creatorAfterPurchase?.balance?.[badgeTypeToPurchase?.currency] || 0

    const feeMultiplier =
      SHOWCASE_COMMISSION_FEE_MULTIPLIER - (badgeTypeAfterPurchase?.donationAmount || 0)

    expect(purchasedBadgeItem.badgeTypeId).toEqual(badgeTypeToPurchase.id)
    expect(purchasedBadgeItem?.edition).toEqual(badgeTypeToPurchase.sold + 1)
    expect(purchasedBadgeItem.ownerId).toEqual(testUser?.id)
    expect(badgeTypeAfterPurchase?.sold).toEqual(badgeTypeToPurchase.sold + 1)
    expect(receipt?.buyerId).toEqual(testUser?.id)
    expect(receipt?.sellerId).toEqual(badgeTypeToPurchase.creatorId)
    expect(balanceAfterPurchase).toEqual(
      balanceBeforePurchase + badgeTypeToPurchase.price * feeMultiplier
    )
    expect(causeAfterPurchase?.numberOfContributions).toEqual(
      (cause?.numberOfContributions || 0) + 1
    )
    expect(causeAfterPurchase?.[`balance${badgeTypeToPurchase?.currency}` as keyof Cause]).toEqual(
      (cause?.[`balance${badgeTypeToPurchase?.currency}` as keyof Cause] as number) +
        badgeTypeToPurchase.price * (badgeTypeToPurchase?.donationAmount || 0)
    )
  })

  it('should fail if buyer doesnt have neccesary payment information', async () => {
    const dummyPhone = `3670978${getRandomNum()}`
    const newUser = await AuthLib.createNewUser(dummyPhone, '36')
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]

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
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]

    const testBadgeItemWithTypeAndOwner = await prisma.badgeItem.findFirst({
      where: {
        badgeTypeId: {
          equals: badgeTypeToPurchase.id,
        },
      },
    })

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
    const soldoutBadgeType = badgeTypes.filter((b) => b.supply === b.sold)[0]
    const testUser = await prisma.user.findFirst({
      where: {
        badgeItemsOwned: {
          none: {
            badgeTypeId: {
              equals: soldoutBadgeType.id,
            },
          },
        },
      },
    })

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

  it('should fail if buyer is the creator of the desired badge', async () => {
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]

    const inputBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: badgeTypeToPurchase?.id || '',
    }

    let error = ''
    try {
      await purchaseBadge(inputBadgeTypeId, badgeTypeToPurchase?.creatorId || '')
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(PurchaseErrorMessages.badgeCreatedByUser)
  })

  // it('should fail if buyer reached its spending limit and badge is sold for money', async () => {

  // })

  // todo: test currency conversion once we add this feature
})
