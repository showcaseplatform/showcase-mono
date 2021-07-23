import { mockCreateUser } from '../../test/testHelpers'
import { getRandomNum } from '../../utils/randoms'
import { AuthLib } from './authLib'

describe('AuthLib user test cases', () => {
  it.only('createNewUser should create a new user in database', async () => {
    const dummyPhone =  `3670978${getRandomNum()}`

    mockCreateUser(dummyPhone)

    const user = await AuthLib.createNewUser(dummyPhone, '36')
    expect(user.phone).toEqual(dummyPhone)
  })
})
