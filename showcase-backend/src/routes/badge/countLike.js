/* eslint-disable promise/no-nesting */
const { firestore: db, FieldValue } = require('../../services/firestore')

module.exports = (req, res) => {
  const { marketplace, badgeid } = req.body
  let user = req.user.data()

  if (user.liked && user.liked[badgeid]) {
    return res.status(422).send('Already liked')
  } else {
    //let updateData = {liked:FieldValue.arrayUnion(badgeid)};
    user.liked[badgeid] = true
    db.collection('users')
      .doc(user.uid)
      .update({ liked: user.liked })
      .then((snapshot) => {
        if (marketplace) {
          return db
            .collection('badgesales')
            .doc(badgeid)
            .update({ likes: FieldValue.increment(1) })
            .then((snapshot) => {
              return res.send('OK')
            })
            .catch((err) => {
              console.log('Error getting documents', err)
              return res.status(422).send({ error: err })
            })
        } else {
          return db
            .collection('badges')
            .doc(badgeid)
            .update({ likes: FieldValue.increment(1) })
            .then((snapshot) => {
              return res.send('OK')
            })
            .catch((err) => {
              console.log('Error getting documents', err)
              return res.status(422).send({ error: err })
            })
        }
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        return res.status(422).send({ error: err })
      })
  }
}
