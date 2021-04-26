const { firestore: db } = require('../../services/firestore')

module.exports = (req, res) => {
  const requestUserId = req.query.userid.toLowerCase()
  const lastDocumentDate = req.query.lastdate

  if (requestUserId) {
    let feedQuery = db.collection('badges')
    feedQuery = feedQuery.where('ownerId', '==', requestUserId)

    feedQuery = feedQuery.where('removedFromShowcase', '==', false)

    if (lastDocumentDate) {
      feedQuery = feedQuery.where('createdDate', '<', new Date(lastDocumentDate))
    }

    feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15)

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
  } else {
    return res.status(422).send({ error: 'Invalid user' })
  }
}
