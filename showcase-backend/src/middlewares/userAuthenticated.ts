import { Response } from 'express'
import { firestore as db, auth } from '../services/firestore'
import { ApiRequest } from '../types/request'
import { User } from '../types/user'

export const userAuthenticated = async (req: ApiRequest, res: Response, next: any) => {
  const { token } = req?.body
  if (token) {
    try {
      const decodedIdToken = await auth().verifyIdToken(token)
      console.log('ID Token correctly decoded', decodedIdToken)
      const uid = decodedIdToken.uid
      const userDoc = await db.collection('users').doc(uid).get()
      const user = userDoc.data() as User
      if (user.banned === true || user.banned === 'true') {
        return res.status(403).send('Unauthorized')
      } else {
        req.user = user
        return next()
      }
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error)
      return res.status(403).send('Unauthorized')
    }
  } else {
    console.error('Missing AUTHENTICATION token')
    return res.status(403).send('Unauthorized')
  }
}
