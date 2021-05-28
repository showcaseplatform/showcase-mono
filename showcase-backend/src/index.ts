// Import packages
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Import services
import { functions } from './services/firestore'

// Import triggers
import { badgeSaleWriteTrigger } from './triggers/badgeSaleWrite'
import { userDeletionTrigger } from './triggers/userDeletion'
import { onUserWriteTrigger } from './triggers/userWrite'
import { badgeSaleDeletionTrigger } from './triggers/badgeSaleIndexDeletion'

// Import jobs
import { updateExchangeRatesJob } from './jobs/updateExchangeRates'

// Import middlewares
import { globalErrorHandler } from './middlewares/globalErrorHandler'

// Import routing
import { MainController } from './controllers/main'
import { checkExpoReceiptsJob } from './jobs/checkNotificationReceipts'

import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { resolvers as crudResolvers } from '@generated/type-graphql'
import { PrismaClient } from '@prisma/client'
import { MarketplaceResolver } from './resolvers/marketplaceResolver'
import { InventoryResolver } from './resolvers/inventoryResolver'
import { SocialResolver } from './resolvers/socialResolver'
import { getUserFromToken } from './libs/auth/getUserFromToken'
import { TestResolver } from './resolvers/testResolver'
import { AuthResolver } from './resolvers/authResolver'

// Set up express server
const app = express()
app.use(cors({ origin: true }))
app.use(cookieParser())
app.use(express.json())

// Setup REST api routes
MainController(app)

// Add error handling
app.use(globalErrorHandler)
app.listen(process.env.PORT || 3000)

// Set up GQL api server
const prisma = new PrismaClient()

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [
      ...crudResolvers,
      MarketplaceResolver,
      InventoryResolver,
      SocialResolver,
      AuthResolver,
      TestResolver,
    ],
    validate: true,
    // here provide all the types that are missing in schema
    //   orphanedTypes: [FirstObject],
  })

  const server = new ApolloServer({
    // typeDefs,
    schema,
    playground: true,
    context: async ({ req }): Promise<any> => {
      // Get the user token from the headers.
      const token = req.headers.authorization || ''
      // Try to retrieve a user with the token
      let authUser = await getUserFromToken(token)

      // Only for testing purposes
      if (!authUser) {
        const users = await prisma.user.findMany()
        authUser = users[0]
        console.log(users[0])
      }

      return { prisma, user: authUser }
    },
  })
  server.applyMiddleware({ app, path: '/graphql', cors: true })
}

bootstrap()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// // Api
// export const api = functions.runWith({ timeoutSeconds: 30 }).https.onRequest(app)

// // Jobs
// export const updateExchangeRates = updateExchangeRatesJob
// export const checkExpoReceipts = checkExpoReceiptsJob

// // Triggers
// export const onUserWrite = onUserWriteTrigger
// export const onUserDeletion = userDeletionTrigger
// export const onBadgeSaleWrite = badgeSaleWriteTrigger
// export const onBadgeSaleDeletion = badgeSaleDeletionTrigger
