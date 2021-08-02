import 'reflect-metadata'
import { prisma } from '../../../services/prisma'
import { createTestDb } from '../../../database/createDb'
import { listBadgeForSale, ListBadgeForSaleErrorMessages } from '../listBadgeForSale'
import { ListBadgeForSaleInput } from '../types/listBadgeForSale.type'
import { Currency } from '@generated/type-graphql'

describe('Listing a badge for sale', () => {
  beforeEach(async () => {
    await createTestDb(prisma)
  })

  it('should update badge item', async () => {
    const testBadgeItem = await prisma.badgeItem.findFirst({ where: { forSale: false } })
    const input: ListBadgeForSaleInput = {
      sig: 'testSig',
      message: 'testMessage',
      currency: Currency.EUR,
      price: 1,
      badgeItemId: testBadgeItem?.id || '',
    }
    const updatedBadgeItem = await listBadgeForSale(input, testBadgeItem?.ownerId || '')

    expect(updatedBadgeItem.forSale).toBeTruthy()
    expect(updatedBadgeItem.forSaleDate).toBeTruthy()
    expect(updatedBadgeItem.salePrice).toEqual(input.price)
    expect(updatedBadgeItem.saleCurrency).toEqual(input.currency)
  })

  
  it('should fail if badge already on sale', async () => {
    const testBadgeItem = await prisma.badgeItem.findFirst({ where: { forSale: true } })
    const input: ListBadgeForSaleInput = {
      sig: 'testSig',
      message: 'testMessage',
      currency: Currency.EUR,
      price: 1,
      badgeItemId: testBadgeItem?.id || '',
    }

    await expect(
      async () => await listBadgeForSale(input, testBadgeItem?.ownerId || '')
    ).rejects.toThrowError(ListBadgeForSaleErrorMessages.onSale)
  })

  it('should fail if user doesnt own the badge', async () => {
    const testBadgeItem = await prisma.badgeItem.findFirst({ where: { forSale: false } })
    const input: ListBadgeForSaleInput = {
      sig: 'testSig',
      message: 'testMessage',
      currency: Currency.EUR,
      price: 1,
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

    await expect(
      async () => await listBadgeForSale(input, testUser?.id || '')
    ).rejects.toThrowError(ListBadgeForSaleErrorMessages.userNotOwner)
  })
})
