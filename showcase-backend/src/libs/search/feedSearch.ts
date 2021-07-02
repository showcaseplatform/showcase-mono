import {
  ConnectionEdge,
  ConnectionPageInfo,
  Cursor,
  CursorConnectionResponse,
} from '../../resolvers/types/cursorConnection'
import { prisma, Prisma } from '../../services/prisma'
import { FeedSearchInput } from './types/feedSearch.type'
import { BadgeType } from '@generated/type-graphql'

interface PrismaCursor {
  id: Cursor
}
interface PaginateBadgeTypes {
  where: any
  cursor: PrismaCursor | undefined
  skip: number | undefined
  take: number
}

const findPaginatedBadgeTypes = async ({ where, cursor, skip, take }: PaginateBadgeTypes) => {
  return await prisma.badgeType.findMany({
    where,
    cursor,
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const feedSearch = async (input: FeedSearchInput): Promise<CursorConnectionResponse> => {
  const { search: contains, category, forwardPagination, backwardPagination } = input

  let take: number
  let inputCursor: Cursor = ''

  if (forwardPagination) {
    take = forwardPagination.first
    inputCursor = forwardPagination.after
  } else if (backwardPagination) {
    take = backwardPagination.last * -1
    inputCursor = backwardPagination.before
  } else {
    take = 10
  }

  const mode = Prisma.QueryMode.insensitive

  const whereCategory = category
    ? {
        category: { equals: category },
      }
    : {}

  const whereSearch = contains
    ? {
        OR: [
          {
            title: {
              contains,
              mode,
            },
          },
          {
            description: {
              contains,
              mode,
            },
          },
          {
            creator: {
              profile: {
                displayName: {
                  contains,
                  mode,
                },
              },
            },
          },
          {
            creator: {
              profile: {
                username: {
                  contains,
                  mode,
                },
              },
            },
          },
          {
            cause: {
              name: {
                contains,
                mode,
              },
            },
          },
          {
            cause: {
              site: {
                contains,
                mode,
              },
            },
          },
        ],
      }
    : {}

  const cursor = inputCursor ? { id: inputCursor } : undefined
  const skip = inputCursor ? 1 : undefined

  const badges = await findPaginatedBadgeTypes({
    where: {
      ...whereCategory,
      ...whereSearch,
    },
    cursor,
    skip,
    take,
  })

  const edges: ConnectionEdge[] = badges.map((badge) => {
    return {
      cursor: badge.id,
      node: { ...badge },
    }
  })

  const startCursor = edges[0]?.cursor ? { id: edges[0].cursor } : undefined
  const endCursor = edges[edges.length - 1]?.cursor
    ? { id: edges[edges.length - 1].cursor }
    : undefined

  const hasNextPage = async () => {
    const nextBadge = await findPaginatedBadgeTypes({
      where: {
        ...whereCategory,
        ...whereSearch,
      },
      cursor: endCursor,
      skip: 1,
      take: 1,
    })
    console.log({ nextBadge })

    return nextBadge.length > 0 
  }

  const hasPreviousPage = async () => {
    const previousBadge = await findPaginatedBadgeTypes({
      where: {
        ...whereCategory,
        ...whereSearch,
      },
      cursor: startCursor,
      skip: 1,
      take: -1,
    })

    console.log({ previousBadge })

    return previousBadge.length > 0
  }

  const pageInfo: ConnectionPageInfo = {
    hasNextPage: await hasNextPage(),
    hasPreviousPage: await hasPreviousPage(),
    startCursor: startCursor?.id || '',
    endCursor: endCursor?.id || '',
  }

  return { edges, pageInfo }
}
