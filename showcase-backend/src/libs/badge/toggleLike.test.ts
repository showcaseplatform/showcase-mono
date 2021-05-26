import { ToggleLikeInput } from '../../resolvers/types/toggleLikeInput'
import { mockCreateLikeBadge, mockCreateLikeBadgeType } from '../../test/testHelpers'
import { createLikeRecord } from './toggleLike'


test('createLikeRecord should create new LikeBadgeType record if badge viewed in marketplace', async () => {
  const badgeTypeId = 'badgeTypeId'
  const likerUserId = 'likerUserId'

  const input: ToggleLikeInput = {
    badgeId: badgeTypeId,
    marketplace: true,
  }

  mockCreateLikeBadgeType(badgeTypeId, likerUserId)

  await expect(createLikeRecord(input, likerUserId)).resolves.toHaveProperty('badgeTypeId', badgeTypeId)
  await expect(createLikeRecord(input, likerUserId)).resolves.toHaveProperty('profileId', likerUserId)
})

test('createLikeRecord should create new LikeBadgeType record if badge viewed NOT in marketplace', async () => {
  const badgeItemId = 'badgeItemId'
  const likerUserId = 'likerUserId'

  const input: ToggleLikeInput = {
    badgeId: badgeItemId,
    marketplace: false,
  }

  mockCreateLikeBadge(badgeItemId, likerUserId)

  await expect(createLikeRecord(input, likerUserId)).resolves.toHaveProperty('badgeId', badgeItemId)
  await expect(createLikeRecord(input, likerUserId)).resolves.toHaveProperty('profileId', likerUserId)
})
