const { firestore: db } = require('../../services/firestore')
const stripe = require('../../services/stripe').default

module.exports = (req, res) => {
  const { user } = req
  const { stripetoken, lastfour } = req.body
  if (!lastfour) {
    // todo: additional length validation?
    return res.status(422).send({ error: 'Invalid Card' })
  } else {
    stripe.customers
      .create({
        source: stripetoken,
        metadata: {
          uid: user.uid,
          phone: user.phoneNumber,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
        },
        phone: user.phoneNumber,
      })
      .then((customer) => {
        console.log('created stripe customer id:', customer.id, customer)
        db.collection('users')
          .doc(user.uid)
          .update({ stripeId: customer.id, stripeLastFourDigits: lastfour })
          .then((done) => {
            console.log('Updated profile')
            return res.send('OK')
          })
          .catch((err) => {
            return res.status(422).send({ error: err })
          })
        return res.send('OK')
      })
      .catch((error) => {
        console.error(error)
        return res.status(422).send({ error: error.toString() })
      })
  }
}
