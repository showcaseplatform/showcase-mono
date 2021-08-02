import 'reflect-metadata'
import { prisma } from '../../../services/prisma'
import { createTestDb } from '../../../database/createDb'
import { CountViewInput, ViewInfo } from '../types/countView.type'
import { CountBadgeViewErrorMessages, countView } from '../countBadgeView'
import { BadgeTypeView } from '@generated/type-graphql'

describe('Toggleing countView', () => {
  beforeAll(async () => {
    await createTestDb(prisma)
  })

  it('should create new BadgeTypeView record if badge viewed in marketplace and message if already viewed', async () => {
    const badgeType = await prisma.badgeType.findFirst()

    const testUser = await prisma.user.findFirst({
      where: {
        badgeTypeViews: {
          every: {
            badgeTypeId: {
              not: badgeType?.id || '',
            },
          },
        },
      },
    })

    const input: CountViewInput = {
      badgeId: badgeType?.id || '',
      marketplace: true,
    }

    const view = (await countView(input, testUser?.id || '')) as BadgeTypeView

    expect(view?.userId).toEqual(testUser?.id)
    expect(view).toHaveProperty('badgeTypeId', badgeType?.id)

    const viewAgain = (await countView(input, testUser?.id || '')) as ViewInfo
    expect(viewAgain?.info).toEqual(CountBadgeViewErrorMessages.alreadyViewed)
  })


  it('should create new BadgeItemView record if badge NOT viewed in marketplace and message if already viewed', async () => {
    const badgeItem  = await prisma.badgeItem.findFirst()

    const testUser = await prisma.user.findFirst({
      where: {
        badgeItemViews: {
          every: {
            badgeItemId: {
              not: badgeItem?.id || '',
            },
          },
        },
      },
    })

    const input: CountViewInput = {
      badgeId: badgeItem?.id || '',
      marketplace: false,
    }

    const view = (await countView(input, testUser?.id || '')) as BadgeTypeView

    expect(view?.userId).toEqual(testUser?.id)
    expect(view).toHaveProperty('badgeItemId', badgeItem?.id)

    const viewAgain = (await countView(input, testUser?.id || '')) as ViewInfo
    expect(viewAgain?.info).toEqual(CountBadgeViewErrorMessages.alreadyViewed) 
  })
})
