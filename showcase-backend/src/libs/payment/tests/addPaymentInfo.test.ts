import { UserType } from '@prisma/client'
import { getDefaultUser, mockFindUniqueProfile, mockUpdateUser } from '../../../test/testHelpers'
import { AddPaymentInfoInput } from '../types/addPaymentInfo.type'
import { getRandomNum } from '../../../utils/randoms'
import { addPaymentInfo } from '../addPaymentInfo'

const inputData: AddPaymentInfoInput = {
  idToken: `${getRandomNum()}`,
  lastFourCardDigit: '1234',
}

const inputUserId = `${getRandomNum()}`


describe('Adding payment information to a user', () => {
  it('should change userType to collector if user is still basic', async () => {
    const inputUserType = UserType.basic
    const inputUser = getDefaultUser(inputUserId, inputUserType)

    mockFindUniqueProfile(inputUser.id)
    const updatedUserType =
      inputUserType != (UserType.basic as UserType) ? inputUserType : UserType.collector
    mockUpdateUser(inputUser.id, updatedUserType)

    const user = await addPaymentInfo(inputData, inputUser)

    expect(user.id).toBe(inputUserId)
    expect(user.userType).not.toBe(UserType.basic)
  })

  it('should not change userType if user is collector or creator', async () => {

    const inputUserType = UserType.creator
    const inputUser = getDefaultUser(inputUserId, inputUserType)

    mockFindUniqueProfile(inputUser.id)
    const updatedUserType =
      inputUserType != (UserType.basic as UserType) ? inputUserType : UserType.collector
    mockUpdateUser(inputUser.id, updatedUserType)

    const user = await addPaymentInfo(inputData, inputUser)

    expect(user.id).toBe(inputUserId)
    expect(user.userType).toBe(inputUserType)
  })
})
