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

// import { relayStylePagination } from '@apollo/client/utilities'

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
    // typePolicies: {
    // Query: {
    //   fields: {
    //     feedSearch: { // relayStylePagination(),
    //       keyArgs: ['after', 'category'],
    //       merge(
    //         existing: FeedSearchResponse,
    //         incoming: FeedSearchResponse,
    //         { args, readField }: { args: FeedSearchInput; readField: any }
    //       ) {
    //         let edges = existing ? existing.edges.slice(0) : []
    //         let offset = offsetFromCursor(
    //           edges,
    //           args.forwardPagination?.after,
    //           readField
    //         )

    //         if (offset > -1) {
    //           edges.slice(offset, offset + args.forwardPagination?.first)
    //         }

    //         for (let i = 0; i < incoming.edges.length; i++) {
    //           edges[offset + i] = incoming.edges[i]
    //         }

    //         const merged: FeedSearchResponse = {
    //           ...incoming,
    //           edges,
    //         }

    //         return merged
    //       },

    //       read(
    //         existing: FeedSearchResponse,
    //         { args, readField }: { args: FeedSearchInput; readField: any }
    //       ) {
    //         if (existing) {
    //           if (args.category) {
    //             return {
    //               ...existing,
    //               edges: existing.edges.filter(
    //                 (e) => e.node.category === args.category
    //               ),
    //             }
    //           }

    //           let offset = offsetFromCursor(
    //             existing.edges,
    //             args.forwardPagination?.after,
    //             readField
    //           )
    //           if (offset < 0) {
    //             offset = 0
    //           }

    //           return {
    //             ...existing,
    //             edges: existing.edges.slice(0, offset),
    //           }
    //         }
    //       },
    //     },
    //   },
    // },
    // },
  }),
  link,
})

// function offsetFromCursor(items, cursor, readField) {
//   for (let i = items.length - 1; i >= 0; --i) {
//     const item = items[i]
//     if (readField('id', item) === cursor) {
//       return i + 1
//     }
//   }
//   return -1
// }

// import { __rest } from 'tslib'

// type KeyArgs = FieldPolicy<any>['keyArgs']

// const notExtras = ['edges', 'pageInfo']
// const getExtras = (obj: Record<string, any>) => __rest(obj, notExtras)

// function makeEmptyData(): TExistingRelay<any> {
//   return {
//     edges: [],
//     pageInfo: {
//       hasPreviousPage: false,
//       hasNextPage: true,
//       startCursor: '',
//       endCursor: '',
//     },
//   }
// }

// export function relayStylePagination<TNode = Reference>(
//   keyArgs: KeyArgs = false
// ): RelayFieldPolicy<TNode> {
//   return {
//     keyArgs,

//     read(existing, { canRead, readField }) {
//       if (!existing) {
//         return
//       }

//       const edges: TRelayEdge<TNode>[] = []
//       let firstEdgeCursor = ''
//       let lastEdgeCursor = ''
//       existing.edges.forEach((edge) => {
//         // Edges themselves could be Reference objects, so it's important
//         // to use readField to access the edge.edge.node property.
//         if (canRead(readField('node', edge))) {
//           edges.push(edge)
//           if (edge.cursor) {
//             firstEdgeCursor = firstEdgeCursor || edge.cursor || ''
//             lastEdgeCursor = edge.cursor || lastEdgeCursor
//           }
//         }
//       })

//       const { startCursor, endCursor } = existing.pageInfo || {}

//       const ret = {
//         // Some implementations return additional Connection fields, such
//         // as existing.totalCount. These fields are saved by the merge
//         // function, so the read function should also preserve them.
//         ...getExtras(existing),
//         edges,
//         pageInfo: {
//           ...existing.pageInfo,
//           // If existing.pageInfo.{start,end}Cursor are undefined or "", default
//           // to firstEdgeCursor and/or lastEdgeCursor.
//           startCursor: startCursor || firstEdgeCursor,
//           endCursor: endCursor || lastEdgeCursor,
//         },
//       }

//       console.log('return obj', ret.pageInfo)

//       return ret
//     },

//     merge(
//       existing = makeEmptyData(),
//       incoming,
//       { args, isReference, readField }
//     ) {

//       const incomingEdges = incoming.edges
//         ? incoming.edges.map((edge) => {
//           if (isReference((edge = { ...edge }))) {
//             // In case edge is a Reference, we read out its cursor field and
//             // store it as an extra property of the Reference object.
//             edge.cursor = readField<string>('cursor', edge)
//           }
//           return edge
//         })
//         : []

//       if (incoming.pageInfo) {
//         const { pageInfo } = incoming
//         const { startCursor, endCursor } = pageInfo
//         const firstEdge = incomingEdges[0]
//         const lastEdge = incomingEdges[incomingEdges.length - 1]
//         // In case we did not request the cursor field for edges in this
//         // query, we can still infer cursors from pageInfo.
//         if (firstEdge && startCursor) {
//           firstEdge.cursor = startCursor
//         }
//         if (lastEdge && endCursor) {
//           lastEdge.cursor = endCursor
//         }
//         // Cursors can also come from edges, so we default
//         // pageInfo.{start,end}Cursor to {first,last}Edge.cursor.
//         const firstCursor = firstEdge && firstEdge.cursor
//         if (firstCursor && !startCursor) {
//           incoming = mergeDeep(incoming, {
//             pageInfo: {
//               startCursor: firstCursor,
//             },
//           })
//         }
//         const lastCursor = lastEdge && lastEdge.cursor
//         if (lastCursor && !endCursor) {
//           incoming = mergeDeep(incoming, {
//             pageInfo: {
//               endCursor: lastCursor,
//             },
//           })
//         }
//       }

//       let prefix = existing.edges
//       let suffix: typeof prefix = []

//       if (args && args.after) {
//         // This comparison does not need to use readField("cursor", edge),
//         // because we stored the cursor field of any Reference edges as an
//         // extra property of the Reference object.
//         const index = prefix.findIndex((edge) => edge.cursor === args.after)
//         if (index >= 0) {
//           prefix = prefix.slice(0, index + 1)
//           // suffix = []; // already true
//         }
//       } else if (args && args.before) {
//         const index = prefix.findIndex((edge) => edge.cursor === args.before)
//         suffix = index < 0 ? prefix : prefix.slice(index)
//         prefix = []
//       } else if (incoming.edges) {
//         // If we have neither args.after nor args.before, the incoming
//         // edges cannot be spliced into the existing edges, so they must
//         // replace the existing edges. See #6592 for a motivating example.
//         prefix = []
//       }

//       const edges = [...prefix, ...incomingEdges, ...suffix]

//       const pageInfo: TRelayPageInfo = {
//         // The ordering of these two ...spreads may be surprising, but it
//         // makes sense because we want to combine PageInfo properties with a
//         // preference for existing values, *unless* the existing values are
//         // overridden by the logic below, which is permitted only when the
//         // incoming page falls at the beginning or end of the data.
//         ...incoming.pageInfo,
//         ...existing.pageInfo,
//       }

//       if (incoming.pageInfo) {
//         const {
//           hasPreviousPage,
//           hasNextPage,
//           startCursor,
//           endCursor,
//           ...extras
//         } = incoming.pageInfo

//         // If incoming.pageInfo had any extra non-standard properties,
//         // assume they should take precedence over any existing properties
//         // of the same name, regardless of where this page falls with
//         // respect to the existing data.
//         Object.assign(pageInfo, extras)

//         // Keep existing.pageInfo.has{Previous,Next}Page unless the
//         // placement of the incoming edges means incoming.hasPreviousPage
//         // or incoming.hasNextPage should become the new values for those
//         // properties in existing.pageInfo. Note that these updates are
//         // only permitted when the beginning or end of the incoming page
//         // coincides with the beginning or end of the existing data, as
//         // determined using prefix.length and suffix.length.
//         if (!prefix.length) {
//           if (void 0 !== hasPreviousPage) {
//             pageInfo.hasPreviousPage = hasPreviousPage
//           }
//           if (void 0 !== startCursor) {
//             pageInfo.startCursor = startCursor
//           }
//         }
//         if (!suffix.length) {
//           if (void 0 !== hasNextPage) {
//             pageInfo.hasNextPage = hasNextPage
//           }
//           if (void 0 !== endCursor) {
//             pageInfo.endCursor = endCursor
//           }
//         }
//       }

//       return {
//         ...getExtras(existing),
//         ...getExtras(incoming),
//         edges,
//         pageInfo,
//       }
//     },
//   }
// }

export default client
