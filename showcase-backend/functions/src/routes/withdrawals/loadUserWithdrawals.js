const db = require('firebase-admin').firestore()

module.exports = (req, res) => {
  let user = req.user.data()

  let feedQuery = db.collection('withdrawals')
  feedQuery = feedQuery.where('user', '==', user.uid.toLowerCase())
  feedQuery = feedQuery.where('success', '==', true)

  if (req.body.lastdate) {
    feedQuery = feedQuery.where('created', '<', new Date(req.body.lastdate))
  }

  feedQuery = feedQuery.orderBy('created', 'desc').limit(15)

  feedQuery
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(422).send({ error: 'End of feed' })
      }

      let docs = snapshot.docs.map((x) => {
        const y = x.data()
        y.id = x.id
        return y
      })

      return res.json({ feed: docs })
    })
    .catch((err) => {
      console.log('Error getting documents', err)
      return res.status(422).send({ error: err })
    })
}
