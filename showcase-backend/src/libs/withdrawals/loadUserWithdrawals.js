const { firestore: db } = require('../../services/firestore')

module.exports = (req, res) => {
  const { user } = req
  const lastDocumentDate = req.query.lastdate

  let feedQuery = db.collection('withdrawals')
  feedQuery = feedQuery.where('user', '==', user.uid.toLowerCase())
  feedQuery = feedQuery.where('success', '==', true)

  if (lastDocumentDate) {
    feedQuery = feedQuery.where('created', '<', new Date(lastDocumentDate))
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
