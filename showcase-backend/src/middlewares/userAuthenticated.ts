import { Response } from 'express'
import { firestore as db, auth } from '../services/firestore'
import { prisma } from '../services/prisma'
import { ApiRequest } from '../types/request'
import { User } from '../types/user'

export const userAuthenticated = async (req: ApiRequest, res: Response, next: any) => {
  try {
    const token = req.headers?.authorization
    console.log({ token })
    if (!token) throw 'Missing authentication token'

    const { uid } = await auth().verifyIdToken(token.replace('Bearer ', ''))
    const user = await prisma.profile.findUnique({
      where: {
        userId: uid
      }
    })

    if (!userDoc.exists) throw 'User doesnt exists'

    const user = userDoc.data() as User
    if (user.banned === true || user.banned === 'true') {
      return res.status(401).send('Unauthorized')
    } else {
      req.user = user
      return next()
    }
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error)
    return res.status(401).send('Unauthorized')
  }
}
