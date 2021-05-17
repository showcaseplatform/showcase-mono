import { PrismaClient, User } from '@prisma/client'


const prisma = new PrismaClient()

test.skip('create users', async () => {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })
})

test('Initial prisma test', async () => {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
});