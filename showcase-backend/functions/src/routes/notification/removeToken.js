const db = require('firebase-admin').firestore()

module.exports = (req, res) => {
  let user = req.user.data()
  return db
    .collection('users')
    .doc(user.uid)
    .update({ notificationToken: null })
    .then((done) => {
      console.log('Removed notification token')
      return res.send('OK')
    })
    .catch((err) => {
      return res.status(422).send({ error: err })
    })
}
