import { UserType, Category, Currency, PrismaClient } from '.prisma/client'
import faker from 'faker'
import { BadgeTypeCreateWithoutCreatorInput } from '@generated/type-graphql'

export const addCreatorsFixture = async (prisma: PrismaClient) => {
  await createUserWithBadgeTypes(prisma, 'fixture-creator-1')
  await createUserWithFakeBadgeTypes(prisma, 'fake-creator-2')
}

const createUserWithFakeBadgeTypes = async (prisma: PrismaClient, id: string) => {
  await prisma.user.create({
    data: {
      id,
      authId: id,
      phone: faker.phone.phoneNumber(),
      userType: UserType.creator,
      profile: {
        create: {
          bio: faker.lorem.paragraph(),
          displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
          username: `${faker.name.firstName()}_${faker.datatype.number()}`,
          avatar: faker.image.avatar(),
        },
      },
      badgeTypesCreated: {
        create: [...generateFakeBadgeType(10)],
      },
    },
  })
}

const generateFakeBadgeType = (amount: number) => {
  let i = 0
  let fakeBadgeTypes: BadgeTypeCreateWithoutCreatorInput[] = []
  while (i < amount) {
    i++
    fakeBadgeTypes.push({
      id: faker.datatype.uuid(),
      title: `Fake BadgeType Title ${i}`,
      price: 1,
      supply: 10,
      description: faker.lorem.paragraph(),
      category: i % 3 === 0 ? Category.art : i % 3 === 0 ? Category.culinary : Category.style,
      currency: i % 3 === 0 ? Currency.GBP : i % 3 === 0 ? Currency.EUR : Currency.USD,
      sold: 0,
      shares: 0,
      soldout: false,
      removedFromShowcase: false,
      tokenTypeId: faker.datatype.uuid(),
      image: faker.image.imageUrl(),
      imageHash: faker.datatype.uuid(),
      uri: `https://showcase.to/badge/fake${faker.datatype.number(100000)}`,
    })
  }
  return fakeBadgeTypes
}

const createUserWithBadgeTypes = async (prisma: PrismaClient, id: string) => {
  await prisma.user.create({
    data: {
      id,
      authId: id,
      phone: faker.phone.phoneNumber(),
      userType: UserType.creator,
      profile: {
        create: {
          bio: faker.lorem.paragraph(),
          displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
          username: `${faker.name.firstName()}_${faker.datatype.number()}`,
          avatar: faker.image.avatar(),
        },
      },
      badgeTypesCreated: {
        create: [
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 1`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.animals,
            currency: Currency.USD,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            causeId: 1,
            donationAmount: 0.1,
            tokenTypeId:
              '57896044618658097711785492504343953927315557066662158946655541218820101242880',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fphoto_2020-11-05_19-11-24.jpg?alt=media`,
            imageHash: `a128574dc5c00a210ef72615f7bf6c22`,
            uri: `https://showcase.to/badge/f760997f4321e772fcf455b24061198ab720cb30f8f93549a7c98d57e4804077`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 2`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.art,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            causeId: 2,
            donationAmount: 0.1,
            tokenTypeId:
              '57896044618658097711785492504343953929016968901266851263972414255978942300160',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fgiph6.gif?alt=media`,
            imageHash: `2973d3caefc59b3855b142471699e054`,
            uri: `https://showcase.to/badge/0cff3fbe9d08c79fc868d8ceca06576101c938049f8099c7a615bec0ba89d65f`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 3`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.causes,
            currency: Currency.GBP,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            causeId: 3,
            donationAmount: 0.1,
            tokenTypeId:
              '57896044618658097711785492504343953927996121800504035873582290433683637665792',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fphoto_2020-11-05_19-11-33.jpg?alt=media`,
            imageHash: `2db442f461864b529cabdfc27a9f07f9`,
            uri: `https://showcase.to/badge/0d206d0b43b50837a407adb4014b8dd31871fb21e01447d7d1c9b245b71aa926`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 4`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.culinary,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            causeId: 4,
            donationAmount: 0.1,
            tokenTypeId:
              '57896044618658097711785492504343953953517299319574420633335385991066253524992',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fphoto_2020-11-05_19-10-36.jpg?alt=media`,
            imageHash: `f78b08c61b91aaf53fa99fc4ba4e674f`,
            uri: `https://showcase.to/badge/0da1cd08b01138f69b5fa51a47992d7dffcf3c3543941727c3425291da054a29`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 5`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.gaming,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            causeId: 5,
            donationAmount: 0.1,
            tokenTypeId:
              '57896044618658097711785492504343953929016968901266851263972414255978942300161',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2F14942d2eb536352d88d754d847d524f15c51ee1d0c9593ae3d534138818f347b?alt=media&datenow=1613062172`,
            imageHash: `40382ffe893efcfc6d87d391d6b9dd8c`,
            uri: `https://showcase.to/badge/14942d2eb536352d88d754d847d524f15c51ee1d0c9593ae3d534138818f347b`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 6`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.music,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953928676686534345912800509039648547174088704',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2F186ee4a8123c5c35b967378e1a479e3bff41acd66413321e9f94e881f04cda19?alt=media&datenow=1611766968`,
            imageHash: `0df6c8fa4df36283b54b813d6c0957cc`,
            uri: `https://showcase.to/badge/186ee4a8123c5c35b967378e1a479e3bff41acd66413321e9f94e881f04cda19`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 7`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.podcasts,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953929697533635108728190899163470842478723072',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2F32e565c0a453325db5f38b34fffa225699b38f84ec4859c70254c8c9dbf11c24?alt=media&datenow=1617896504`,
            imageHash: `5096aaf67fa92bc6046d8a576ac2e28d`,
            uri: `https://showcase.to/badge/32e565c0a453325db5f38b34fffa225699b38f84ec4859c70254c8c9dbf11c24`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 8`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.sports,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953950454758017285974462165014524180339621888',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fphoto_2020-11-05_19-10-30.jpg?alt=media`,
            imageHash: `63a9f0322150dad112e3581fe58f6bed`,
            uri: `https://showcase.to/badge/6028ecdcf660cdbaaed380a98234e167c9a0a920fe988dc7a2aa0b18ff135b6a`,
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 9`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.sports,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953930037816002029666654362538078274246934528',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2F3c266eb8605c2e103ec8223fd748999f6b0d86710ffb97d9db59e7b905d486df?alt=media&datenow=1618219660`,
            imageHash: `62b43ea4741de1dda4838fed0619fe9e`,
            uri: 'https://showcase.to/badge/3c266eb8605c2e103ec8223fd748999f6b0d86710ffb97d9db59e7b905d486df',
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 10`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.style,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953930037816002029666654362538078274246934529',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2F3d56ad5ff806ebf244fd367f96f90a15a3693103e1123dbbb73d8f68f6ab6f4d?alt=media&datenow=1604942459`,
            imageHash: `24eb168dd05bba1d746dcbf28ab21764`,
            uri: 'https://showcase.to/badge/3d56ad5ff806ebf244fd367f96f90a15a3693103e1123dbbb73d8f68f6ab6f4d',
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 11`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.technology,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953952496452218811605242945262168770948890624',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fphoto_2020-11-05_19-11-24.jpg?alt=media`,
            imageHash: `4ff6f5e34bf0c2a0c0ff40cec012b4b4`,
            uri: 'https://showcase.to/badge/4a767bb299090b261f9d8f4707e58eb42111f1b6e654209717c0459ba625ee4e',
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 12`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.travel,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953949774193283444097535238265309316803198976',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fphoto_2020-11-05_19-10-00.jpg?alt=media`,
            imageHash: `0a4ca219893591864ad3848c08a497ee`,
            uri: 'https://showcase.to/badge/4c0665a66c48b11d576d9a7332cbe98ce3655dfa432933bfdb422e3192d72927',
          },
          {
            id: faker.datatype.uuid(),
            title: `BadgeType Title 12`,
            price: 1,
            supply: 10,
            description: faker.lorem.paragraph(),
            category: Category.vlogs,
            currency: Currency.EUR,
            sold: 0,
            shares: 0,
            soldout: false,
            removedFromShowcase: false,
            tokenTypeId:
              '57896044618658097711785492504343953952156169851890666779481887561339180679168',
            image: `https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fgiph3.gif?alt=media`,
            imageHash: `c10ec91674cff1cf4e5a3caf5b92917c`,
            uri: 'https://showcase.to/badge/4d96a3117718e6d8085fc7d87fe4fe06f03a87af2710b92b617f8916172a0bc2',
          },
        ],
      },
    },
  })
}
