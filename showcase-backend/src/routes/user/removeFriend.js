/* eslint-disable promise/no-nesting */
const { firestore: db, FieldValue } = require('../../services/firestore')

module.exports = async (req, res) => {
  const { user } = req
  if (req.body.userid) {
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(req.body.userid)
      .delete()
      .then(() => {
        return db
          .collection('users')
          .doc(req.body.userid)
          .collection('followers')
          .doc(user.uid)
          .delete()
          .then(() => {
            db.collection('users')
              .doc(user.uid)
              .update({ followingCount: FieldValue.increment(-1) })
              .then(() => {
                return true
              })
              .catch((err) => {
                console.log('ERR updating user on unfollow', err)
                return true
              })
            db.collection('users')
              .doc(req.body.userid)
              .update({ followersCount: FieldValue.increment(-1) })
              .then(() => {
                return true
              })
              .catch((err) => {
                console.log('ERR updating other user on unfollow', err)
                return true
              })
            return res.send('OK')
          })
          .catch((err) => {
            console.log('ERR0 updating other user on unfollow', err)
            return res.status(422).send({ error: err })
          })
      })
      .catch((err) => {
        console.log('ERR0 updating user on unfollow', err)
        return res.status(422).send({ error: err })
      })
  } else {
    return res.status(422).send({ error: 'Invalid user' })
  }
}
