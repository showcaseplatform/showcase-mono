import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import tokenStore from '../persistence/token'

import { DEV_API } from '@env'

const httpLink = createHttpLink({ uri: DEV_API })

const withToken = setContext(async () => {
  const token = await tokenStore.get()
  return { token }
})

const authMiddleware = new ApolloLink((operation, forward) => {
  const { token } = operation.getContext()
  operation.setContext(() => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }))

  return forward(operation)
})

const logoutLink = onError(({ networkError }) => {
  if (networkError?.statusCode === 401) {
    tokenStore.remove()
  }
})

const link = ApolloLink.from([
  withToken,
  logoutLink,
  authMiddleware.concat(httpLink),
])

const clientA = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})

export default clientA
