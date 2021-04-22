const db = require('firebase-admin').firestore()

module.exports = (req, res) => {
  //if (req.user){
  //}
  let feedQuery = db.collection('badgesales')

  feedQuery = feedQuery.where('soldout', '==', false)

  if (req.body.lastdate) {
    feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate))
  }

  if (req.body.category) {
    feedQuery = feedQuery.where('category', '==', req.body.category.toLowerCase())
  }

  feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15)

  feedQuery
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(422).send({ error: 'End of feed' })
      }

      let docs = snapshot.docs.map((x) => x.data())

      return res.json({ feed: docs })
    })
    .catch((err) => {
      console.log('Error getting documents', err)
      return res.status(422).send({ error: err })
    })
}
