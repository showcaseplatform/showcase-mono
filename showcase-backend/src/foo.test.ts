import { PrismaClient, User } from '@prisma/client'


const prisma = new PrismaClient()

test('create users', async () => {
  await prisma.user.create({
    data: {
      phone: '3670987654321',
      email: 'alice2@prisma.io',
      profile: {
        create: { bio: 'I like turtles', displayName: 'alice2', username: 'alice2' },
      },
    },
  })
})

test('get users', async () => {
  const allUsers = await prisma.user.findMany()
});


test('create new cause', async () => {
  await prisma.cause.create({
    data: {
      name: "Carpathia Foundation",
      site: "https://www.carpathia.org/",
      image: "https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fcarpathia.jpg?alt=media"
    }
  })
});