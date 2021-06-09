import { Currency, PrismaClient, User, Category, Profile } from '@prisma/client'
import { checkIfNewUser } from './sendPhoneCode'

const prisma = new PrismaClient()

const getRandomNum = () => {
  return Math.floor(Math.random() * 899999 + 100000)
}

let testUser: User | null = null
let testProfile: Profile | null = null

afterEach(async() => {
  await prisma.user.deleteMany()
})
beforeAll(async() => {
  await prisma.user.deleteMany()
})

test('findOrCreateUser should create new user if user doesnt exists', async () => {
  const dummyPhone = '+36709788821'
  const user = await checkIfNewUser(dummyPhone)
  expect(user).toHaveProperty('phone', dummyPhone)
})

test('findOrCreateUser should return user if user already exists', async () => {
  const phone = '123456789'
  const user = await prisma.user.create({
    data: {
      phone,
      authId: "123456"
    }
  })

  const returnedUser = await checkIfNewUser(phone)
  expect(returnedUser).toHaveProperty('phone', phone)
  expect(returnedUser).toHaveProperty('id', user.id)
})

