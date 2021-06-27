// Import packages
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import * as dotenv from 'dotenv'
import { join } from 'path'
process.chdir(join(__dirname, '..'))
const dotenvPath = join(__dirname, '..', '.env')
dotenv.config({ path: dotenvPath })

// Import middlewares
import { globalErrorHandler } from './middlewares/globalErrorHandler'

// Import routing
import { MainController } from './controllers/mainController'

import { prisma } from './services/prisma'
import { MyApollo } from './services/apollo'
import { ShowcaseCron } from './jobs'
import http from 'http'

const main = async () => {
  // Set up express server
  const expressApp = express()

  expressApp.use(cors({ origin: true }))
  expressApp.use(cookieParser())
  expressApp.use(express.json({ limit: '2mb' }))

  // Need this to handle subscriptions (http + ws)
  const httpServer = http.createServer(expressApp)

  // Setup REST api routes
  MainController(expressApp)

  const apolloService = new MyApollo(expressApp, httpServer)
  const apolloServer = await apolloService.init()

  const cronJobs = new ShowcaseCron()
  cronJobs.init()

  // todo: check if type-gql error handler middleware is better
  // Add error handling
  expressApp.use(globalErrorHandler)

  // Make sure to call listen on httpServer, NOT on app.
  const port = process.env.PORT || 3000
  httpServer.listen(port)
  console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`)

  // expressApp.listen(process.env.PORT || 3000)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
