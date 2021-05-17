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

// import { buildSchema } from 'graphql'
import { NotificationResolver } from './models/notifcationModel'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { userAuthenticated } from './middlewares/userAuthenticated'

// Set up REST api server
const app = express()
app.use(cors({ origin: true }))
app.use(cookieParser())
app.use(express.json());

// Setup routes
MainController(app)

// Add error handling
app.use(globalErrorHandler)
app.listen(process.env.PORT || 3000)

// Set up GQL api server
export const resolvers = [NotificationResolver] as const

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [NotificationResolver],
    // here provide all the types that are missing in schema
    //   orphanedTypes: [FirstObject],
  })

  app.use('/gql', userAuthenticated)

  // other initialization code, like creating http server
  const server = new ApolloServer({
    // typeDefs,
    schema,
    playground: true,
    // a () => {} to build our context object.
    context: ({ req }) => {
      const { user } = req as any
      console.log({user})
      return {
        user
      };
    },
  })
  server.applyMiddleware({ app, path: '/gql', cors: true })
}

bootstrap()


// Api
export const api = functions.runWith({ timeoutSeconds: 30 }).https.onRequest(app)

// Jobs
export const updateExchangeRates = updateExchangeRatesJob
export const checkExpoReceipts = checkExpoReceiptsJob

// Triggers
export const onUserWrite = onUserWriteTrigger
export const onUserDeletion = userDeletionTrigger
export const onBadgeSaleWrite = badgeSaleWriteTrigger
export const onBadgeSaleDeletion = badgeSaleDeletionTrigger
