/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin')
const db = admin.firestore()
const FieldValue = admin.firestore.FieldValue

module.exports = async (req, res) => {
  let user = req.user.data()
  if (req.body.userid) {
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(req.body.userid)
      .set({ uid: req.body.userid, createdDate: new Date() })
      .then(() => {
        return db
          .collection('users')
          .doc(req.body.userid)
          .collection('followers')
          .doc(user.uid)
          .set({ uid: user.uid, createdDate: new Date() })
          .then(() => {
            db.collection('users')
              .doc(user.uid)
              .update({ followingCount: FieldValue.increment(1) })
              .then(() => {
                return true
              })
              .catch((err) => {
                console.log('ERR updating user on follow', err)
                return true
              })
            db.collection('users')
              .doc(req.body.userid)
              .update({ followersCount: FieldValue.increment(1) })
              .then(() => {
                return true
              })
              .catch((err) => {
                console.log('ERR updating other user on follow', err)
                return true
              })
            return res.send('OK')
          })
          .catch((err) => {
            console.log('ERR0 updating other user on follow', err)
            return res.status(422).send({ error: err })
          })
      })
      .catch((err) => {
        console.log('ERR0 updating user on follow', err)
        return res.status(422).send({ error: err })
      })
  } else {
    return res.status(422).send({ error: 'Invalid user' })
  }
}
