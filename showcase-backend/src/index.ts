// Import packages
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Import middlewares
import { globalErrorHandler } from './middlewares/globalErrorHandler'

// Import routing
import { MainController } from './controllers/mainController'

import { prisma } from './services/prisma'
import { MyApollo } from './services/apollo'

const main = async () => {
  // Set up express server
  const expressApp = express()

  expressApp.use(cors({ origin: true }))
  expressApp.use(cookieParser())
  expressApp.use(express.json({ limit: '2mb' }))

  // Setup REST api routes
  MainController(expressApp)

  const apolloService = new MyApollo()
  const apolloServer = await apolloService.init()
  const path = '/graphql'
  expressApp.listen(process.env.PORT || 3000)

  apolloServer.applyMiddleware({ app: expressApp, path, cors: true })

  // todo: check if type-gql error handler middleware is better
  // Add error handling
  expressApp.use(globalErrorHandler)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
