import { Category, Currency, PrismaClient, NotificationType } from '@prisma/client'
const prisma = new PrismaClient()
const getRandomNum = () => {
  return Math.floor(Math.random() * 899999 + 100000)
}

const main = async () => {
  const id = getRandomNum().toString()

  
  const currencyRates = await prisma.currencyRate.create({
    data: {
      EUR: 0.822265,
      GBP: 0.707141,
      USD: 1,
    },
  })

  const carpathiaFoundation = await prisma.cause.create({
    data: {
      name: `Carpathia Foundation`,
      site: `https://www.carpathia.org/`,
      image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fcarpathia.jpg?alt=media`,
    },
  })

  const createAlice = await prisma.smsVerification.create({
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
              tokenTypeId: id,
              sold: 1,
              shares: 0,
              soldout: false,
              removedFromShowcase: false,
              causeId: carpathiaFoundation.id,
              donationAmount: 0.1,
            },
          },
          notifications: {
            create: {
              type: NotificationType.NEW_MESSAGE_RECEIVED,
              title: 'First message title',
              message: 'First message title',
            },
          },
        },
      },
    },
  })

  const aliceWithBadgeType = await prisma.user.findUnique({
    where: {
      phone: createAlice.phone,
    },
    include: {
      badgeTypesCreated: true,
    },
  })

  if (!aliceWithBadgeType) return
  const bobPhone = `+3670978${id.substring(1)}1`
  const bob = await prisma.smsVerification.create({
    data: {
      phone: bobPhone,
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
              tokenId: `badgeToken_${getRandomNum()}`,
              badgeTypeId: aliceWithBadgeType?.badgeTypesCreated[0].id || ``,
              creatorId: aliceWithBadgeType?.id || ``,
              edition: 1,
              purchaseDate: new Date(),
              likes: {
                create: {
                  userId: aliceWithBadgeType.id,
                },
              },
            },
          },
        },
      },
    },
  })

  const bobWithBadgeItem = await prisma.user.findUnique({
    where: {
      phone: bobPhone,
    },
    include: {
      badgeItemsOwned: true
    }
  })

  if(!bobWithBadgeItem) return

  await prisma.receipt.create({
    data: {
      badgeTypeId: aliceWithBadgeType?.badgeTypesCreated[0].id || ``,
      creatorId: aliceWithBadgeType?.id || ``,
      recipientId: bobWithBadgeItem.id,
      badgeItemId: bobWithBadgeItem.badgeItemsOwned[0].id || '',
      convertedCurrency: Currency.EUR,
      convertedRate: currencyRates.EUR,
      convertedPrice: aliceWithBadgeType?.badgeTypesCreated[0].price * currencyRates.EUR,
      transactionHash: `${getRandomNum()}`,
      stripeChargeId: `${getRandomNum()}`,
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
