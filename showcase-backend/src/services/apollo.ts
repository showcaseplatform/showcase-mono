import { ApolloServer } from 'apollo-server-express'
import { getUserFromToken } from '../libs/auth/getUserFromToken'
import { AuthResolver } from '../resolvers/authResolver'
import { generatedResolvers } from '../resolvers/generatedResolver'
import { InventoryResolver } from '../resolvers/inventoryResolver'
import { MarketplaceResolver } from '../resolvers/marketplaceResolver'
import { NotificationResolver } from '../resolvers/notifcationResolver'
import { PaymentResolver } from '../resolvers/paymentResolver'
import { SocialResolver } from '../resolvers/socialResolver'
import { TestResolver } from '../resolvers/testResolver'
import { authChecker } from '../libs/auth/authChecker'
import { buildSchema, NonEmptyArray } from 'type-graphql'
import { prisma, PrismaClient } from './prisma'
import { User } from '@prisma/client'
import { ChatResolver } from '../resolvers/chatResolver'

export interface MyContext {
  prisma: PrismaClient
  user: User | null
}

export class MyApollo {
    
  async init() {
    const schema = await buildSchema({
      resolvers: [
        ...(generatedResolvers as unknown as NonEmptyArray<Function>), //todo: find nicer solution
        MarketplaceResolver,
        InventoryResolver,
        SocialResolver,
        AuthResolver,
        TestResolver,
        NotificationResolver,
        PaymentResolver,
        ChatResolver
      ],
      validate: true,
      authChecker,
      // here provide all the types that are missing in schema
      //   orphanedTypes: [FirstObject],
    })

    const apolloServer = new ApolloServer({
      schema,
      playground: true,
      introspection: true,
      context: async ({ req }): Promise<MyContext> => {
        // Get the user token from the headers.
        const token = req.headers.authorization || ''

        // Try to retrieve a user with the token
        let authUser = await getUserFromToken(token)

        // Only for testing purposes
        if (!authUser && token === 'test') {
          const users = await prisma.user.findMany()
          authUser = users[0]
          console.log({authUser})
        }

        return { prisma, user: authUser }
      },
    })

    return apolloServer
  }
}
