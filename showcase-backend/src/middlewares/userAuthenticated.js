const admin = require('firebase-admin')
const db = admin.firestore()

exports.userAuthenticated = async (req, res, next) => {
  if (req.body.token) {
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(req.body.token)
      console.log('ID Token correctly decoded', decodedIdToken)
      let uid = decodedIdToken.uid
      req.user = await db.collection('users').doc(uid).get()
      if (req.user.banned === true || req.user.banned === 'true') {
        return res.status(403).send('Unauthorized')
      } else {
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
