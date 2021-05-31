// import { Currency, PrismaClient, User, Category, Profile } from '@prisma/client'

// const prisma = new PrismaClient()

// const getRandomNum = () => {
//   return Math.floor(Math.random() * 899999 + 100000)
// }

// let testUser: User | null = null
// let testProfile: Profile | null = null

// test('create user', async () => {
//   const randomNum = getRandomNum()
//   testUser = await prisma.user.create({
//     data: {
//       phone: `367098${randomNum}`,
//       authId: `${randomNum}`,
//       profile: {
//         create: {
//           bio: 'I like turtles',
//           displayName: `Alice ${randomNum}`,
//           username: `alice_${randomNum}`,
//         },
//       },
//     },
//   })
//   console.log({ testUser })
// })

// test('get users', async () => {
//   await prisma.user.findMany()
// });

// test.skip('create new cause', async () => {
//   await prisma.cause.create({
//     data: {
//       name: "Carpathia Foundation",
//       site: "https://www.carpathia.org/",
//       image: "https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fcarpathia.jpg?alt=media"
//     }
//   })
// });

// test('get all causes', async () => {
//   const allCauses = await prisma.cause.findMany()
//   // console.log({allCauses})
// });

// test('get cause', async () => {
//   const cause1 = await prisma.cause.findUnique({where: {
//     id: 1
//   }})
//   // console.log({cause1})
// });

// test('create new badgeType', async () => {
//   const id = getRandomNum().toString()

//   testProfile = await prisma.profile.findUnique({
//     where: {
//       userId: testUser?.id
//     }
//   })

//   await prisma.badgeType.create({
//     data: {
//       id,
//       title: 'BadgeType Title',
//       price: 1,
//       supply: 10,
//       description: 'BadgeType description',
//       image:
//         'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fgiph6.gif?alt=media',
//       imageHash: '2973d3caefc59b3855b142471699e054',
//       category: Category.Art,
//       uri: 'https://showcase.to/badge/' + id,
//       creatorProfileId: testProfile?.id || '',
//       currency: testProfile?.currency|| Currency.USD,
//       tokenTypeBlockhainId: id,
//       sold: 0,
//       views: 0,
//       likes: 0,
//       shares: 0,
//       soldout: false,
//       forSale: false,
//       removedFromShowcase: false,
//     },
//   })
// })

// // test('get all causes', async () => {
// //   const allCauses = await prisma.cause.findMany()
// //   console.log({ allCauses })
// // })
