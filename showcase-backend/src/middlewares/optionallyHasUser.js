const { auth, firestore: db } = require('../services/firestore')

exports.optionallyHasUser = async (req, res, next) => {
  if (req.body.token) {
    try {
      const decodedIdToken = await auth().verifyIdToken(req.body.token)
      console.log('ID Token correctly decoded', decodedIdToken)
      let uid = decodedIdToken.uid
      req.user = await db.collection('users').doc(uid).get()
      return next()
    } catch (error) {
      return next()
    }
  } else {
    return next()
  }
}
