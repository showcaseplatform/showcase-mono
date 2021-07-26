import 'reflect-metadata'
import { Currency } from '@prisma/client'
import prisma from '../../services/prisma'
import { getRandomNum } from '../../utils/randoms'
import { AuthLib } from './authLib'
describe('AuthLib user test cases', () => {
  it.only('createNewUser should add a new user to database with balance and profile', async () => {
    const dummyPhone = `3670978${getRandomNum()}`

    const user = await AuthLib.createNewUser(dummyPhone, '36')

    const testUser = await prisma.user.findUnique({
      where: {
        phone: dummyPhone,
      },
      include: {
        balance: true,
        profile: true
      }
    })

    expect(user.phone).toEqual(testUser?.phone)
    expect(testUser?.balance?.EUR).toEqual(0)
    expect(testUser?.balance?.GBP).toEqual(0)
    expect(testUser?.balance?.USD).toEqual(0)
    expect(testUser?.profile?.username.length).toBeGreaterThan(0)
    expect(testUser?.profile?.displayName.length).toBeGreaterThan(0)
    expect([Currency.USD, Currency.GBP, Currency.EUR]).toContain(testUser?.profile?.currency)
  })
})
