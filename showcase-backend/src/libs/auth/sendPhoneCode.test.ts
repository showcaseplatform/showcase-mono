import { mockUser } from '../../test/testHelpers'
import { AuthLib } from './authLib'

describe('Create user test cases', () => {
  it.only('findOrCreateUser should create a new user if user doesnt exists', async () => {
    const dummyPhone = '+36709788821'

    mockUser(dummyPhone)

    const user = await AuthLib.createNewUser(dummyPhone, '36')
    expect(user.phone).toEqual(dummyPhone)
  })
})
