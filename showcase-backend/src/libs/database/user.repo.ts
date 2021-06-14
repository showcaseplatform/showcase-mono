import { GraphQLError } from 'graphql'
import prisma from '../../services/prisma'

enum UserRepoErrors {
  UniqueNotFound = 'User not found with provided phone',
}

export const findUserByPhone = async (phone: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    })
    if (user) {
      return user
    } else {
      throw new GraphQLError(UserRepoErrors.UniqueNotFound)
    }
  } catch (error) {
    throw new GraphQLError(UserRepoErrors.UniqueNotFound)
  }
}
