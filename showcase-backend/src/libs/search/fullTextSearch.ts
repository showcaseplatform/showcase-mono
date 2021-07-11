import { BadgeType, Profile, Cause } from '@prisma/client'
import prisma from '../../services/prisma'

const mode = 'insensitive'
const createdAt = 'desc'

// todo: add pagination once concept is finalized
export const fullTextSearch = async (
  search: string
): Promise<{
  badgeTypes: BadgeType[]
  profiles: Profile[]
  causes: Cause[]
}> => {
  const contains = search

  const [badgeTypes = [], profiles = [], causes = []] = await prisma.$transaction([
    searchBadgeTypes(contains),
    searchProfiles(contains),
    searchCauses(contains),
  ])
  return { badgeTypes, profiles, causes }
}

const searchBadgeTypes = (contains: string) => {
  return prisma.badgeType.findMany({
    where: {
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
              OR: [
                {
                  displayName: {
                    contains,
                    mode,
                  },
                },
                {
                  username: {
                    contains,
                    mode,
                  },
                },
                {
                  bio: {
                    contains,
                    mode,
                  },
                },
              ],
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt,
    },
  })
}

const searchProfiles = (contains: string) => {
  return prisma.profile.findMany({
    where: {
      OR: [
        {
          displayName: {
            contains,
            mode,
          },
        },
        {
          username: {
            contains,
            mode,
          },
        },
        {
          bio: {
            contains,
            mode,
          },
        },
      ],
    },
    orderBy: {
      createdAt,
    },
  })
}

const searchCauses = (contains: string) => {
  return prisma.cause.findMany({
    where: {
      OR: [
        {
          name: {
            contains,
            mode,
          },
        },
        {
          site: {
            contains,
            mode,
          },
        },
      ],
    },
    orderBy: {
      createdAt,
    },
  })
}
