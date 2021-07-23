import { ToggleLikeInput } from '../types/toggleLike.type'
import { mockCreateBadgeItemLike, mockCreateBadgeTypeLike } from '../../../test/testHelpers'
import { createLikeRecord } from '../toggleLike'

describe('createLikeRecord test cases', () => {
  it('createLikeRecord should create new LikeBadgeType record if badge viewed in marketplace', async () => {
    const badgeTypeId = 'badgeTypeId'
    const likerUserId = 'likerUserId'

    const input: ToggleLikeInput = {
      badgeId: badgeTypeId,
      marketplace: true,
    }

    mockCreateBadgeTypeLike(badgeTypeId, likerUserId)
    const createdRecord = await createLikeRecord(input, likerUserId)

    expect(createdRecord.userId).toEqual(likerUserId)
    expect(createdRecord).toHaveProperty('badgeTypeId', badgeTypeId)
  })

  it('createLikeRecord should create new LikeBadgeType record if badge viewed NOT in marketplace', async () => {
    const badgeItemId = 'badgeItemId'
    const likerUserId = 'likerUserId'

    const input: ToggleLikeInput = {
      badgeId: badgeItemId,
      marketplace: false,
    }

    mockCreateBadgeItemLike(badgeItemId, likerUserId)

    const createdRecord = await createLikeRecord(input, likerUserId)

    expect(createdRecord.userId).toEqual(likerUserId)
    expect(createdRecord).toHaveProperty('badgeItemId', badgeItemId)
  })
})
