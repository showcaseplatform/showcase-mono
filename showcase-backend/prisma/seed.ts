import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: `alice@prisma.io`,
      phone: '3670987654321',
      profile: {
        create: { bio: 'I like turtles', displayName: 'alice', username: 'alice' },
      },
    },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: `bob@prisma.io`,
      phone: '3670987654321',
      profile: {
        create: { bio: 'I like turtles', displayName: 'bob', username: 'bob' },
      },
    },
  })
  
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })