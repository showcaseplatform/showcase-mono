const db = require('firebase-admin').firestore()

module.exports = (req, res) => {
  let user = req.user.data()
  let { notificationtoken } = req.body
  return db
    .collection('users')
    .doc(user.uid)
    .update({ notificationToken: notificationtoken })
    .then((done) => {
      console.log('Updated notification token')
      return res.send('OK')
    })
    .catch((err) => {
      return res.status(422).send({ error: err })
    })
}
