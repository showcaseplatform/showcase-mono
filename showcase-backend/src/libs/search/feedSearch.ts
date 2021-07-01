import { prisma, Prisma } from '../../services/prisma'
import { FeedSearchInput } from './types/feedSearch.type'

export const feedSearch = async (input: FeedSearchInput) => {
  const { search: contains, category, cursor: inputCursor, take } = input

  const mode = 'insensitive' as Prisma.QueryMode

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

  return await prisma.badgeType.findMany({
    where: {
      ...whereCategory,
      ...whereSearch,
    },
    cursor,
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
  })
}
