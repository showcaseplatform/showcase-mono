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
import { relayStylePagination } from '@apollo/client/utilities'

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

// todo: TEMP 401 handling cuz gql error missing status
const logoutLink = onError((error) => {
  error.graphQLErrors &&
    error.graphQLErrors.map((err) => {
      if (
        err.message ===
        "Access denied! You don't have permission for this action!"
      ) {
        tokenStore.remove()
      }
    })
})

const link = ApolloLink.from([
  withToken,
  logoutLink,
  authMiddleware.concat(httpLink),
])

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feedSearch: relayStylePagination(),
        },
      },
    },
  }),
  link,
})

export default client
