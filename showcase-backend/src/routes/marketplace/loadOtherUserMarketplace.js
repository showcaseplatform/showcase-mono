const { firestore: db } = require('../../services/firestore')

module.exports = (req, res) => {
  if (req.body.userid) {
    let feedQuery = db.collection('badgesales')
    feedQuery = feedQuery.where('creatorId', '==', req.body.userid.toLowerCase())

    feedQuery = feedQuery.where('removedFromShowcase', '==', false)

    if (req.body.lastdate) {
      feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate))
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
