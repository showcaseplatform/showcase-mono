// import { Category, Currency, PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
// const getRandomNum = () => {
//   return Math.floor(Math.random() * 899999 + 100000)
// }

// const main = async () => {
//   const id = getRandomNum().toString()
//   const alice = await prisma.user.upsert({
//     where: { email: 'alice@prisma.io' },
//     update: {},
//     create: {
//       email: `alice@prisma.io`,
//       phone: '3670987654321',
//       profile: {
//         create: {
//           bio: 'I like turtles',
//           displayName: 'alice',
//           username: 'alice',
//           badgeTypesCreated: {
//             create: {
//               id,
//               title: 'BadgeType Title',
//               price: 1,
//               supply: 10,
//               description: 'BadgeType description',
//               image:
//                 'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/badgeimages%2Fgiph6.gif?alt=media',
//               imageHash: '2973d3caefc59b3855b142471699e054',
//               category: Category.Art,
//               uri: 'https://showcase.to/badge/' + id,
//               currency: Currency.USD,
//               tokenTypeBlockhainId: id,
//               sold: 0,
//               views: 0,
//               likes: 0,
//               shares: 0,
//               soldout: false,
//               forSale: false,
//               removedFromShowcase: false,
//             },
//           },
//         },
//       },
//     },
//   })

//   const bob = await prisma.user.upsert({
//     where: { email: 'bob@prisma.io' },
//     update: {},
//     create: {
//       email: `bob@prisma.io`,
//       phone: '3670987654321',
//       profile: {
//         create: { bio: 'I like turtles', displayName: 'bob', username: 'bob' },
//       },
//     },
//   })

//   const carpathiaFoundation = await prisma.cause.create({
//     data: {
//       name: "Carpathia Foundation",
//       site: "https://www.carpathia.org/",
//       image: "https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fcarpathia.jpg?alt=media"
//     }
//   })
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
