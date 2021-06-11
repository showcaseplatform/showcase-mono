import prisma from '../../services/prisma'

export const fullTextSearch = async (search: string) => {
    const mode =  "insensitive"
    const [badgeTypes = [], profiles = [], causes =[]] = await prisma.$transaction([
      prisma.badgeType.findMany({
        where: {
          OR: [
            {
              title: {
                contains: search,
                mode
              },
            },
            {
              description: {
                contains: search,
                mode
              },
            },
            {
              creator: {
                profile: {
                  OR: [
                    {
                      displayName: {
                        contains: search,
                        mode
                      },
                    },
                    {
                      username: {
                        contains: search,
                        mode
                      },
                    },
                    {
                      bio: {
                        contains: search,
                        mode
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
      prisma.profile.findMany({
        where: {
          OR: [
            {
              displayName: {
                contains: search,
                mode
              },
            },
            {
              username: {
                contains: search,
                mode
              },
            },
            {
              bio: {
                contains: search,
                mode
              },
            },
          ],
        },
      }),
      prisma.cause.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              site: {
                contains: search,
              },
            },
          ],
        },
      }),
    ])
  return { badgeTypes, profiles, causes }
}
