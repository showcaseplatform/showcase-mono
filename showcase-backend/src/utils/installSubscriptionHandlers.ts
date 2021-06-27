// https://gist.github.com/timkock/b38ae86cf5634c63dc482c7fc1c66be1
// TODO: keep eye on apollo-server release 3.0, that hopefully mitigates this problem
/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */

// requirements
import * as ws from 'ws'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { formatApolloErrors } from 'apollo-server-errors'
import { execute, subscribe } from 'graphql'

// export patch
export function installSubscriptionHandlers(server: any) {
  // eslint-disable-next-line
  // @ts-ignore
  const that = this as any
  if (!that.subscriptionServerOptions) {
    if (that.config.gateway) {
      throw Error('Subscriptions are not supported when operating as a gateway')
    }
    if (that.supportsSubscriptions()) {
      throw Error(
        'Subscriptions are disabled, due to subscriptions set to false in the ApolloServer constructor'
      )
    } else {
      throw Error(
        'Subscriptions are not supported, choose an integration, such as apollo-server-express that allows persistent connections'
      )
    }
  }
  const { onDisconnect, onConnect, keepAlive, path } = that.subscriptionServerOptions
  const { schema } = that
  if (that.schema === undefined) {
    throw new Error('Schema undefined during creation of subscription server.')
  }
  that.subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: onConnect || ((connectionParams: any) => ({ ...connectionParams })),
      onDisconnect,
      onOperation: async (message: any, connection: any) => {
        connection.formatResponse = (value: any) => ({
          ...value,
          errors:
            value.errors &&
            formatApolloErrors([...value.errors], {
              formatter: that.requestOptions.formatError,
              debug: that.requestOptions.debug,
            }),
        })
        connection.formatError = that.requestOptions.formatError
        let context = that.context ? that.context : { connection }
        try {
          context =
            typeof that.context === 'function'
              ? await that.context({ connection, payload: message.payload })
              : context
        } catch (e) {
          throw formatApolloErrors([e], {
            formatter: that.requestOptions.formatError,
            debug: that.requestOptions.debug,
          })[0]
        }
        return { ...connection, context }
      },
      keepAlive,
      validationRules: that.requestOptions.validationRules,
    },
    server instanceof ws.Server
      ? server
      : {
          server,
          path,
        }
  )
}
