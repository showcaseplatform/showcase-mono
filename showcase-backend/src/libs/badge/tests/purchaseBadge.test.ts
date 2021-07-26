/* eslint-disable @typescript-eslint/no-empty-function */
import { getRandomNum } from '../../../utils/randoms'
import { purchaseBadge } from '../purchaseBadge'
import { PurchaseBadgeInput } from '../types/purchaseBadge.type'


const inputBadgeTypeId: PurchaseBadgeInput = {
    badgeTypeId: 'test-id'
}

const inputUserId = `${getRandomNum()}`

// beforeAll(async () => {
//   await createTestDb(prisma)
// })

describe('Purchasing a badge', () => {
  it('should fail if buyer already owned a badgItem from the desired badgeType', async () => {
    
    const badgeItem = await purchaseBadge(inputBadgeTypeId, inputUserId)

  })

  it('should fail is badgeType is sold-out', async () => {

  })

  it('should fail if buyer doesnt have neccesary payment information', async () => {

  })

  it('should fail if buyer reached its spending limit and badge is sold for money', async () => {

  })

  // todo: test currency conversion once we add this feature
})
