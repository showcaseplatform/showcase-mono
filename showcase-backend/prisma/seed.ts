import { Category, Currency, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const getRandomNum = () => {
  return Math.floor(Math.random() * 899999 + 100000)
}

const main = async () => {
  const id = getRandomNum().toString()

  const carpathiaFoundation = await prisma.cause.create({
    data: {
      name: `Carpathia Foundation`,
      site: `https://www.carpathia.org/`,
      image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fcarpathia.jpg?alt=media`,
    },
  })

  const alice = await prisma.smsVerification.create({
    data: {
      phone: `+3670978${id}`,
      code: `111111`,
      attemptsEntered: 1,
      attemptsEnteredSinceValid: 1,
      codesSent: 1,
      codesSentSinceValid: 1,
      expiration: new Date(),
      valid: false,
      user: {
        create: {
          authId: id,
          profile: {
            create: {
              bio: `I like turtles ${id}`,
              displayName: `Alice ${id}`,
              username: `alice_${id}`,
            },
          },
          badgeTypesCreated: {
            create: {
              id,
              title: `BadgeType Title ${id}`,
              price: 1,
              supply: 10,
              description: `BadgeType description ${id}`,
              image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fgiph6.gif?alt=media`,
              imageHash: `2973d3caefc59b3855b142471699e054`,
              category: Category.Art,
              uri: `https://showcase.to/badge/${id}`,
              currency: Currency.USD,
              tokenTypeBlockhainId: id,
              sold: 1,
              shares: 0,
              soldout: false,
              removedFromShowcase: false,
              causeId: carpathiaFoundation.id,
              donationAmount: 0.1,
            },
          },
        },
      },
    },
  })

  const aliceWithBadgeType = await prisma.user.findUnique({
    where: {
      phone: alice.phone,
    },
    include: {
      badgeTypesCreated: true,
    },
  })

  const bob = await prisma.smsVerification.create({
    data: {
      phone: `+3670978${id.substring(1)}1`,
      code: `222222`,
      attemptsEntered: 0,
      attemptsEnteredSinceValid: 0,
      codesSent: 0,
      codesSentSinceValid: 1,
      expiration: new Date(),
      valid: true,
      user: {
        create: {
          authId: id + 1,
          profile: {
            create: {
              bio: `I like turtles ${id}`,
              displayName: `Bob ${id}`,
              username: `bob_${id}`,
            },
          },
          badgeItemsOwned: {
            create: {
              id: `badgeToken_${getRandomNum()}`,
              badgeTypeId: aliceWithBadgeType?.badgeTypesCreated[0].id || ``,
              creatorProfileId: aliceWithBadgeType?.id || ``,
              edition: 1,
              purchaseDate: new Date(),
            },
          },
        },
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
