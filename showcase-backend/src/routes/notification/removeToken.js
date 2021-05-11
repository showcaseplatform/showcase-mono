const { firestore: db } = require('../../services/firestore')

module.exports = (req, res) => {
  const { user } = req
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
