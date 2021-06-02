// Import packages
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Import jobs

// Import middlewares
import { globalErrorHandler } from './middlewares/globalErrorHandler'

// Import routing
// import { MainController } from './controllers/main'

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
import { NotificationResolver } from './resolvers/notifcationResolver'

// Set up express server
const app = express()
app.use(cors({ origin: true }))
app.use(cookieParser())
app.use(express.json())

// Setup REST api routes
// MainController(app)

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
      NotificationResolver
    ],
    validate: true,
    // here provide all the types that are missing in schema
    //   orphanedTypes: [FirstObject],
  })

  const server = new ApolloServer({
    // typeDefs,
    schema,
    playground: true,
    introspection: true,
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
