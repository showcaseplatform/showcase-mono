import 'reflect-metadata'
import prisma from '../../../services/prisma'
import { createTestDb } from '../../../database/createDb'
import { purchaseBadge, PurchaseErrorMessages } from '../purchaseBadge'
import { PurchaseBadgeInput } from '../types/purchaseBadge.type'
import { AuthLib } from '../../auth/authLib'
import { getRandomNum } from '../../../utils/randoms'
import { Cause, UserType } from '@prisma/client'
import { SHOWCASE_COMMISSION_FEE_MULTIPLIER } from '../../../consts/businessRules'
import { deleteDb } from '../../../database/deleteDb'

describe('Purchasing a badge', () => {
  beforeAll(async () => {
    await prisma.$connect()
    await createTestDb(prisma)
  })

  afterAll(async () => {
    await deleteDb(prisma)
    await prisma.$disconnect()
  })

  it('should throw error if invalid input is provided', async () => {
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]

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

    const inputWithValidBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: badgeTypeToPurchase.id,
      badgeItemId: undefined,
    }
    expect(async () => await purchaseBadge(inputWithValidBadgeTypeId, 'fakeId')).rejects.toThrow()

    const inputWithFakeBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: 'fakeId',
      badgeItemId: undefined,
    }
    expect(
      async () => await purchaseBadge(inputWithFakeBadgeTypeId, testUser?.id || '')
    ).rejects.toThrow()

    const inputWithFakeBadgeItemId: PurchaseBadgeInput = {
      badgeTypeId: undefined,
      badgeItemId: 'fakeId',
    }
    expect(
      async () => await purchaseBadge(inputWithFakeBadgeItemId, testUser?.id || '')
    ).rejects.toThrow()
  })

  it('should update badgeType, creator balance, cause and create new badgeItem, receipt when badgeTypeId was provided', async () => {
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
        badgeTypesCreated: {
          none: {
            id: {
              equals: badgeTypeToPurchase.id,
            },
          },
        },
      },
    })

    const purchasedBadgeItem = await purchaseBadge(inputBadgeTypeId, testUser?.id || '')

    const badgeTypeAfterPurchase = await prisma.badgeType.findUnique({
      where: {
        id: badgeTypeToPurchase.id,
      },
    })

    const receipt = (
      await prisma.receipt.findMany({
        where: {
          badgeItemId: purchasedBadgeItem.id,
          buyerId: testUser?.id,
          sellerId: badgeTypeToPurchase.creatorId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      })
    )[0]

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
    expect(receipt).toBeTruthy()
    expect(receipt?.price).toEqual(badgeTypeToPurchase.price)
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

  it('should update sold badgeItem and create receipt when badgeItemId was provided', async () => {
    const badgeItemToPurchase = await prisma.badgeItem.findFirst({
      where: {
        forSale: true,
      },
      include: {
        receipts: true,
      },
    })

    const testUser = await prisma.user.findFirst({
      where: {
        badgeItemsOwned: {
          none: {
            badgeTypeId: {
              equals: badgeItemToPurchase?.badgeTypeId,
            },
          },
        },
        badgeTypesCreated: {
          none: {
            id: {
              equals: badgeItemToPurchase?.badgeTypeId,
            },
          },
        },
      },
    })

    const input: PurchaseBadgeInput = {
      badgeItemId: badgeItemToPurchase?.id,
    }

    const updatedBadgeItem = await purchaseBadge(input, testUser?.id || '')

    const receipts = (
      await prisma.receipt.findMany({
        where: {
          badgeItemId: badgeItemToPurchase?.id,
          buyerId: testUser?.id,
          sellerId: badgeItemToPurchase?.ownerId,
        },
        orderBy: {
          createdAt: 'desc',
        }
      })
    )

    expect(badgeItemToPurchase?.forSale).toBeTruthy()
    expect(badgeItemToPurchase?.edition).toEqual(updatedBadgeItem.edition)
    expect(badgeItemToPurchase?.tokenId).toEqual(updatedBadgeItem.tokenId)
    expect(updatedBadgeItem.forSale).toBeFalsy()
    expect(updatedBadgeItem.saleCurrency).toBeFalsy()
    expect(updatedBadgeItem.salePrice).toBeFalsy()
    expect(updatedBadgeItem.badgeTypeId).toEqual(badgeItemToPurchase?.badgeTypeId)
    expect(updatedBadgeItem.ownerId).toEqual(testUser?.id)
    expect(receipts.length).toBeGreaterThan(badgeItemToPurchase?.receipts.length || 0)
    expect(receipts[0].price).toEqual(badgeItemToPurchase?.salePrice)
    expect(receipts[0].currency).toEqual(badgeItemToPurchase?.saleCurrency)
  })

  it('should fail if buyer doesnt have neccesary payment information', async () => {
    const dummyPhone = `3670978${getRandomNum()}`
    const testUser = await AuthLib.createNewUser(dummyPhone, '36')
    const inputUserId = testUser.id

    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]

    const inputWithBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: badgeTypeToPurchase.id,
    }

    expect(async () => await purchaseBadge(inputWithBadgeTypeId, inputUserId)).rejects.toThrowError(
      PurchaseErrorMessages.paymentInfoMissing
    )

    const badgeItemToPurchase = await prisma.badgeItem.findFirst({
      where: {
        forSale: true,
      },
    })

    const inputWithBadgeItemId: PurchaseBadgeInput = {
      badgeItemId: badgeItemToPurchase?.id || '',
    }

    expect(async () => await purchaseBadge(inputWithBadgeItemId, inputUserId)).rejects.toThrowError(
      PurchaseErrorMessages.paymentInfoMissing
    )
  })

  it('should fail if buyer already owned a badgItem from the desired badgeType', async () => {
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]

    const testBadgeItemWithTypeAndOwner = await prisma.badgeItem.findFirst({
      where: {
        badgeTypeId: {
          equals: badgeTypeToPurchase.id,
        },
        forSale: true,
      },
    })

    const inputWithBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: testBadgeItemWithTypeAndOwner?.badgeTypeId || '',
    }

    const inputUserId = testBadgeItemWithTypeAndOwner?.ownerId || ''

    expect(async () => await purchaseBadge(inputWithBadgeTypeId, inputUserId)).rejects.toThrowError(
      PurchaseErrorMessages.badgeAlreadyOwned
    )

    const inputWithBadgeItemId: PurchaseBadgeInput = {
      badgeItemId: testBadgeItemWithTypeAndOwner?.id || '',
    }

    expect(async () => await purchaseBadge(inputWithBadgeItemId, inputUserId)).rejects.toThrowError(
      PurchaseErrorMessages.badgeAlreadyOwned
    )
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

    expect(
      async () => await purchaseBadge(inputBadgeTypeId, testUser?.id || '')
    ).rejects.toThrowError(PurchaseErrorMessages.outOfStock)
  })

  it('should fail if buyer is the creator of the desired badgeType', async () => {
    const badgeTypes = await prisma.badgeType.findMany()
    const badgeTypeToPurchase = badgeTypes.filter((b) => b.supply > b.sold)[0]

    const inputBadgeTypeId: PurchaseBadgeInput = {
      badgeTypeId: badgeTypeToPurchase?.id || '',
    }

    expect(
      async () => await purchaseBadge(inputBadgeTypeId, badgeTypeToPurchase?.creatorId || '')
    ).rejects.toThrowError(PurchaseErrorMessages.badgeCreatedByUser)
  })

  it('should fail if desired badgeItem is not on sale', async () => {
    const badgeItemToPurchase = await prisma.badgeItem.findFirst({
      where: {
        forSale: false,
      },
    })

    const testUser = await prisma.user.findFirst({
      where: {
        badgeItemsOwned: {
          none: {
            badgeTypeId: {
              equals: badgeItemToPurchase?.badgeTypeId,
            },
          },
        },
        badgeTypesCreated: {
          none: {
            id: {
              equals: badgeItemToPurchase?.badgeTypeId,
            },
          },
        },
      },
    })

    expect(
      async () => await purchaseBadge({ badgeItemId: badgeItemToPurchase?.id }, testUser?.id || '')
    ).rejects.toThrowError(PurchaseErrorMessages.badgeNotAvailableForPurchase)
  })
})
