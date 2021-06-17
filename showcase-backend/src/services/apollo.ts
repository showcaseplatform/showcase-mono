import { ApolloServer } from 'apollo-server-express'
import { AuthResolver } from '../resolvers/authResolver'
import { generatedResolvers } from '../resolvers/generatedResolver'
import { InventoryResolver } from '../resolvers/inventoryResolver'
import { MarketplaceResolver } from '../resolvers/marketplaceResolver'
import { NotificationResolver } from '../resolvers/notifcationResolver'
import { PaymentResolver } from '../resolvers/paymentResolver'
import { SocialResolver } from '../resolvers/socialResolver'
import { buildSchema, NonEmptyArray } from 'type-graphql'
import { prisma, PrismaClient } from './prisma'
import { User } from '@prisma/client'
import { ChatResolver } from '../resolvers/chatResolver'
import { GraphQLError } from 'graphql'
import { Express } from 'express'
import { Server } from 'http'
import { AuthLib } from '../libs/auth/authLib'
import { NotificationSettingsResolver } from '../resolvers/notificationSettingResolver'
import { myPubSub } from './pubSub'
import { SearchResolver } from '../resolvers/search.resolver'
import { customUserResolver } from '../resolvers/customUserResolver'
export interface MyContext {
  prisma: PrismaClient | null
  user: User | null
}
export interface MyAuthContext extends MyContext {
  user: User
}

export class MyApollo {
  app: Express
  httpServer: Server

  constructor(app: Express, httpServer: Server) {
    this.app = app
    this.httpServer = httpServer
  }

  async init() {
    const schema = await buildSchema({
      resolvers: [
        ...(generatedResolvers as unknown as NonEmptyArray<Function>), //todo: find nicer solution
        MarketplaceResolver,
        InventoryResolver,
        SocialResolver,
        AuthResolver,
        NotificationResolver,
        PaymentResolver,
        ChatResolver,
        NotificationSettingsResolver,
        SearchResolver,
        customUserResolver,
      ],
      validate: true,
      authChecker: AuthLib.authChecker,
      // here provide all the types that are missing in schema
      //   orphanedTypes: [FirstObject],
      pubSub: myPubSub  // todo: replace with redisPubSub for production subscriptions
    })

    const apolloServer = new ApolloServer({
      schema,
      playground: true,
      introspection: true,
      context: async ({ req, connection }): Promise<MyContext> => {
        if (connection) {
          return { prisma: null, user: connection.context?.user || null }
        } else {
          // Get the user token from the headers.
          const token = req?.headers?.authorization || ''

          // Try to retrieve a user with the token
          let user: User | null = await AuthLib.getUserByToken(token)


          // Only for testing purposes
          if (!user && token === 'test') {
            const users = await prisma.user.findMany()
            user = users[0]
          }
          
          return { prisma, user }
        }
      },
      subscriptions: {
        path: '/subscriptions',
        onConnect: async (connectionParams: any) => {
          const token = connectionParams.Authorization || ''

          if (!token) {
            throw new GraphQLError('Authorization token is missing!')
          }

          let user: User | null = await AuthLib.getUserByToken(token)

          // Only for testing purposes
          if (!user && token === 'test') {
            const users = await prisma.user.findMany()
            user = users[0]
          }

          return { user }
        },
        onDisconnect: () => console.log('Websocket DISCONNECTED'),
      },
    })

    // Monkey patch
    // https://gist.github.com/timkock/b38ae86cf5634c63dc482c7fc1c66be1
    // apolloServer.installSubscriptionHandlers = installSubscriptionHandlers

    const path = '/graphql'
    apolloServer.applyMiddleware({ app: this.app, path, cors: true })
    apolloServer.installSubscriptionHandlers(this.httpServer)

    return apolloServer
  }
}
