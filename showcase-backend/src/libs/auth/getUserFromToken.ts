import { auth } from '../../services/firestore'
import prisma from '../../services/prisma'

export const getUserFromToken = async (token: string) => {
  if (!token) return null
  const { uid } = await auth().verifyIdToken(token.replace('Bearer ', ''))
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    },
  })

  if (user && user.isBanned != true) {
    return user
  } else {
    return null
  }
}
