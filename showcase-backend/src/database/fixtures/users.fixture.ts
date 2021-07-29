import { UserType, Category, Currency, PrismaClient } from '.prisma/client'
import faker from 'faker'
import {
  UserCreateInput,
  BadgeTypeCreateWithoutCreatorInput,
  BadgeItemCreateWithoutBadgeTypeInput,
} from '@generated/type-graphql'
import Bluebird from 'bluebird'
import { myS3, seedBucket } from '../../services/S3/s3'

const generateRandomNumbers = () => {
  return Math.floor(Math.random() * 100 * 10000).toString()
}

const pickRandomItemFromList = <T>(list: T[]) => {
  // todo: maybe add lodash and use that
  return list[Math.floor(Math.random() * list.length)]
}

const currencyList: Currency[] = Object.values(Currency)
const categoryList: Category[] = Object.values(Category)

export class UserSeeder {
  prisma: PrismaClient

  avatars: any[] = [] // todo: did not work with string
  badges: any[] = []
  collectorIds: any[] = []

  numberOfCollectors: number
  numberOfCreators: number
  numberOfEmptyUsers: number

  constructor(
    prisma: PrismaClient,
    numberOfCollectors: number,
    numberOfCreators: number,
    numberOfEmptyUsers: number
  ) {
    this.prisma = prisma
    this.numberOfCollectors = numberOfCollectors
    this.numberOfCreators = numberOfCreators
    this.numberOfEmptyUsers = numberOfEmptyUsers
  }

  initBucketOBjects = async (): Promise<void> => {
    const { avatars, badges } = await myS3.getListOfS3BucketObjects(seedBucket)
    this.badges = badges || []
    this.avatars = avatars || []
  }

  addUsersFixture = async (): Promise<void> => {
    if (this.badges.length === 0 || this.avatars.length === 0) {
      await this.initBucketOBjects()
    }
    await this.addCollectors(this.numberOfCollectors)
    await this.addCreatorsWithRelationships(this.numberOfCreators)
    await this.addEmptyUsers(this.numberOfEmptyUsers)
  }

  addEmptyUsers = async (amount: number): Promise<void> => {
    const amountArr = [...Array(amount).keys()]
    await Bluebird.map(amountArr, async (i) => {
      return await this.prisma.user.create({
        data: {
          ...this.generateUserDataWithPaymentInfo(`basic-${i}`, UserType.basic),
        },
      })
    })
  }

  addCollectors = async (amount: number): Promise<void> => {
    const amountArr = [...Array(amount).keys()]
    const collectors = await Bluebird.map(amountArr, async (i) => {
      return await this.prisma.user.create({
        data: {
          ...this.generateUserDataWithPaymentInfo(`collector-${i}`, UserType.basic),
        },
      })
    })
    this.collectorIds = collectors.map(({ id }) => id)
  }

  addCreatorsWithRelationships = async (amount: number): Promise<void> => {
    const amountArr = [...Array(amount).keys()]
    const creators = await Bluebird.map(amountArr, async (i) => {
      return await this.prisma.user.create({
        data: {
          ...this.generateUserDataWithPaymentInfo(`creator-${i}`, UserType.creator),
          followers: {
            createMany: {
              data: [
                ...this.collectorIds.map((id) => {
                  return { followerId: id }
                }),
              ],
            },
          },
          badgeTypesCreated: {
            create: [
              ...(await this.generateTestBadgeTypes(10)),
              await this.generateTestSoldOutBadgeType(),
            ],
          },
        },
      })
    })
  }

  generateTestBadgeTypes = async (
    amount: number
  ): Promise<BadgeTypeCreateWithoutCreatorInput[]> => {
    let i = 0
    const testBadgeTypes: BadgeTypeCreateWithoutCreatorInput[] = []
    const causesList = (await this.prisma.cause.findMany()).map((cause) => {
      return cause.id
    })

    while (i < amount) {
      testBadgeTypes.push({
        id: faker.datatype.uuid(),
        title: `BadgeType Title`,
        description: `BadgeType description`,
        category: pickRandomItemFromList<Category>(categoryList),
        currency: pickRandomItemFromList<Currency>(currencyList),
        shares: 0,
        tokenTypeId: faker.datatype.uuid(),
        imageId: pickRandomItemFromList<string>(this.badges),
        imageHash: faker.datatype.uuid(),
        uri: `https://showcase.to/badge/${faker.datatype.uuid()}`,
        cause: {
          connect: {
            id: pickRandomItemFromList<number>(causesList),
          },
        },
        donationAmount: 0.1,
        price: 1,
        supply: this.numberOfCollectors + 5,
        sold: this.numberOfCollectors,
        badgeItems: {
          create: [...this.generateTestBadgeItems(this.numberOfCollectors)],
        },
        likes: {
          createMany: {
            data: [
              ...this.collectorIds.map((id) => {
                return { userId: id }
              }),
            ],
          },
        },
        views: {
          createMany: {
            data: [
              ...this.collectorIds.map((id) => {
                return { userId: id }
              }),
            ],
          },
        },
      })
      i++
    }
    return testBadgeTypes
  }
  generateTestSoldOutBadgeType = async (): Promise<BadgeTypeCreateWithoutCreatorInput> => {
    const causesList = (await this.prisma.cause.findMany()).map((cause) => {
      return cause.id
    })

    return {
      id: faker.datatype.uuid(),
      title: `Soldout BadgeType Title`,
      description: `Soldout badgeType description`,
      category: pickRandomItemFromList<Category>(categoryList),
      currency: pickRandomItemFromList<Currency>(currencyList),
      shares: 0,
      tokenTypeId: faker.datatype.uuid(),
      imageId: pickRandomItemFromList<string>(this.badges),
      imageHash: faker.datatype.uuid(),
      uri: `https://showcase.to/badge/${faker.datatype.uuid()}`,
      cause: {
        connect: {
          id: pickRandomItemFromList<number>(causesList),
        },
      },
      donationAmount: 0.1,
      price: 1,
      supply: 1,
      sold: 1,
      badgeItems: {
        create: [...this.generateTestBadgeItems(1)],
      },
    }
  }

  generateTestBadgeItems = (amount: number): BadgeItemCreateWithoutBadgeTypeInput[] => {
    let i = 0
    const testBadgeItems: BadgeItemCreateWithoutBadgeTypeInput[] = []
    while (i < amount) {
      testBadgeItems.push({
        id: faker.datatype.uuid(),
        owner: {
          connect: {
            id: `collector-${i}`,
          },
        },
        forSale: i % 2 ? true : false,
        purchaseDate: new Date(),
        edition: i + 1,
        tokenId: faker.datatype.uuid(),
      })
      i++
    }
    return testBadgeItems
  }

  generateUserDataWithPaymentInfo = (id: string, userType: UserType): UserCreateInput => {
    return {
      id,
      phone: '+36709' + generateRandomNumbers(),
      userType,
      profile: {
        create: {
          bio: faker.lorem.paragraph(),
          displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
          username: `${faker.name.firstName()}_${faker.datatype.number()}`,
          avatarId: pickRandomItemFromList<string>(this.avatars),
        },
      },
      balance: {
        create: {
          EUR: 0,
          GBP: 0,
          USD: 0,
        },
      },
      paymentInfo: {
        create: {
          idToken: generateRandomNumbers(),
          lastFourCardDigit: '1234',
        },
      },
    }
  }
}
