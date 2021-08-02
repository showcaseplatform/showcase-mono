import 'reflect-metadata'
import { ToggleLikeInput } from '../types/toggleLike.type'
import { toggleLike } from '../toggleLike'
import { prisma } from '../../../services/prisma'
import { AuthLib } from '../../auth/authLib'
import { getRandomNum } from '../../../utils/randoms'
import { createTestDb } from '../../../database/createDb'

describe('Toggleing like', () => {
  beforeEach(async () => {
    await createTestDb(prisma)
  })

  it('should create new BadgeTypeLike record if badge viewed in marketplace', async () => {
    const dummyPhone = `3670978${getRandomNum()}`
    const newUser = await AuthLib.createNewUser(dummyPhone, '36')
    const badgeType = await prisma.badgeType.findFirst()

    const input: ToggleLikeInput = {
      badgeId: badgeType?.id || '',
      marketplace: true,
    }

    const like = await toggleLike(input, newUser.id)

    expect(like.userId).toEqual(newUser.id)
    expect(like).toHaveProperty('badgeTypeId', badgeType?.id)
  })

  it('should create new BadgeTypeLike record if badge viewed NOT in marketplace', async () => {
    const dummyPhone = `3670978${getRandomNum()}`
    const newUser = await AuthLib.createNewUser(dummyPhone, '36')
    const badgeItem = await prisma.badgeItem.findFirst()

    const input: ToggleLikeInput = {
      badgeId: badgeItem?.id || '',
      marketplace: false,
    }

    const createdRecord = await toggleLike(input, newUser.id)

    expect(createdRecord.userId).toEqual(newUser.id)
    expect(createdRecord).toHaveProperty('badgeItemId', badgeItem?.id)
  })
})
