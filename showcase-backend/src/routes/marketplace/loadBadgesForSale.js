const { firestore: db } = require('../../services/firestore')

module.exports = (req, res) => {
  //if (req.user){
  //}
  const lastDocumentDate = req.query.lastdate
  const requestedCategory = req.query.category.toLowerCase()

  let feedQuery = db.collection('badgesales')

  feedQuery = feedQuery.where('soldout', '==', false)

  if (lastDocumentDate) {
    feedQuery = feedQuery.where('createdDate', '<', new Date(lastDocumentDate))
  }

  if (requestedCategory) {
    feedQuery = feedQuery.where('category', '==', requestedCategory)
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
