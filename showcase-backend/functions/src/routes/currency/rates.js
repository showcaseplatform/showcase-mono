const { firestore: db } = require('../../services/firestore')

module.exports = (req, res) => {
  db.collection('currencyrates')
    .doc('rates')
    .get()
    .then((doc) => {
      console.log('Updated currency rates data')
      if (!doc.exists) {
        return res.status(422).send({ error: 'empty currencies' })
      } else {
        return res.json({ currencies: doc.data() })
      }
    })
    .catch((err) => {
      console.log('ERR UPDATING CURRENCY', err)
      return res.status(422).send({ error: err })
    })
}
