const db = require('firebase-admin').firestore()
const { stripe: stripeConfig } = require('../../config')
const stripe = require('stripe')(stripeConfig)

module.exports = (req, res) => {
  let user = req.user.data()
  const { stripetoken, lastfour } = req.body
  if (!lastfour) {
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
