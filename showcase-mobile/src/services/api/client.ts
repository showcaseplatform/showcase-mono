import { Client, dedupExchange, fetchExchange, makeOperation } from 'urql'
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch'
import { gql } from '@urql/core'
import { cacheExchange, DataFields } from '@urql/exchange-graphcache'
import { authExchange } from '@urql/exchange-auth'
import { devtoolsExchange } from '@urql/devtools'
import { DEV_API } from '@env'

import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import { callIfFn } from '../../utils/helpers'

import tokenStore from '../persistence/token'
import { Follow, FollowStatus } from '../../generated/graphql'

interface ToggleFollowDataFields extends DataFields {
  [fieldName: string]: Pick<Follow, 'status'>
}

// not yet typesafe, urql author's - code-gen authors are aware of the missing TS feature
// https://github.com/dotansimha/graphql-code-generator/pull/5950
// https://github.com/FormidableLabs/urql/issues/901
const cache = cacheExchange({
  keys: {
    Follow: (data) => data.userId,
  },
  updates: {
    Mutation: {
      toggleFollow: (result: ToggleFollowDataFields, args, cache, _info) => {
        const amIFollowing =
          result.toggleFollow.status === FollowStatus.Accepted
        if (typeof amIFollowing === 'boolean') {
          cache.writeFragment(
            gql`
              fragment _ on User {
                amIFollowing
              }
            `,
            {
              id: args.userId,
              amIFollowing,
            }
          )
        }
      },
      // updateProfileCustom: (result, args, cache, _info) => {
      //   READ BELOW IS OK
      //   console.log(
      //     'the fragment read:',
      //     cache.readFragment(Me_ProfileFragmentDoc, {
      //       id: '8e222018-0e03-4456-ba94-ecb7f63c5d29',
      //     })
      //   )
      // },
    },
  },
})

type AuthState = {
  token: string
}

const client = new Client({
  url: DEV_API,
  exchanges: [
    dedupExchange,
    cache,
    devtoolsExchange,
    authExchange<AuthState>({
      addAuthToOperation({ authState, operation }) {
        if (!authState || !authState.token) {
          return operation
        }

        const ctx = operation.context

        return makeOperation(
          operation.kind,
          operation,
          flow(
            set('fetchOptions', callIfFn(ctx.fetchOptions)),
            set(
              'fetchOptions.headers.Authorization',
              `Bearer ${authState.token}`
            )
          )(ctx)
        )
      },
      async getAuth({ authState }) {
        if (!authState) {
          const token = await tokenStore.get()
          return token ? { token } : null
        }
        return authState
      },
      willAuthError: ({ authState }) => {
        // todo: expiration handling
        if (!authState) {
          return true
        } else {
          return false
        }
      },
      didAuthError: ({ error }) =>
        // todo: proper 401 handling
        {
          if (error) {
            // ?: auth error shouldn't always remove token ?
            tokenStore.remove()
          }
          return error.graphQLErrors.some(
            (err) => err.extensions?.code === 'UNAUTHENTICATED'
          )
        },
    }),
    fetchExchange,
    multipartFetchExchange,
  ],
})

export default client
