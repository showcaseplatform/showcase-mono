import 'reflect-metadata'
import { prisma } from '../../../services/prisma'
import { createTestDb } from '../../../database/createDb'
import { unlistBadgeForSale, UnlistBadgeForSaleErrorMessages } from '../unlistBadgeForSale'
import { UnListBadgeForSaleInput } from '../types/unlistBadgeForSale.type'

describe('Unlisting a badge for sale', () => {
  beforeEach(async () => {
    await createTestDb(prisma)
  })

  it('should update badge item', async () => {
    const testBadgeItem = await prisma.badgeItem.findFirst({ where: { forSale: true } })
    const input: UnListBadgeForSaleInput = {
      badgeItemId: testBadgeItem?.id || '',
    }
    const updatedBadgeItem = await unlistBadgeForSale(input, testBadgeItem?.ownerId || '')

    expect(updatedBadgeItem.forSale).toBeFalsy()
    expect(updatedBadgeItem.forSaleDate).toBeFalsy()
    expect(updatedBadgeItem.salePrice).toBeFalsy()
    expect(updatedBadgeItem.saleCurrency).toBeFalsy()
  })

  it('should fail if badge not on sale', async () => {
    const testBadgeItem = await prisma.badgeItem.findFirst({ where: { forSale: false } })
    const input: UnListBadgeForSaleInput = {
      badgeItemId: testBadgeItem?.id || '',
    }

    expect(
      async () => await unlistBadgeForSale(input, testBadgeItem?.ownerId || '')
    ).rejects.toThrowError(UnlistBadgeForSaleErrorMessages.notOnSale)
  })

  it('should fail if user doesnt own the badge', async () => {
    const testBadgeItem = await prisma.badgeItem.findFirst({ where: { forSale: false } })
    const input: UnListBadgeForSaleInput = {
      badgeItemId: testBadgeItem?.id || '',
    }

    const testUser = await prisma.user.findFirst({
      where: {
        id: {
          not: {
            equals: testBadgeItem?.id,
          },
        },
      },
    })

    expect(async () => await unlistBadgeForSale(input, testUser?.id || '')).rejects.toThrowError(
      UnlistBadgeForSaleErrorMessages.userNotOwner
    )
  })
})
