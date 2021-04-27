/* eslint-disable promise/no-nesting */
const axios = require('axios')
const { firestore: db } = require('../../services/firestore')
const { blockchain } = require('../../config')
const functions = require('firebase-functions')

module.exports = async (req, res) => {
  let user = req.user.data()

  let { sig, message, badgeid, currency, price } = req.body

  let postData = {
    sig,
    message,
    badgeid,
    badgeowner: user.crypto.address,
    token:  blockchain.authToken,
  }

  if (price < 0 || price > 200 || isNaN(price) || typeof price !== 'number') {
    return res.status(422).send({ error: 'Invalid Price' })
  } else {
    db.collection('badges')
      .where('tokenId', '==', badgeid)
      .get()
      .then((snapshot) => {
        if (snapshot.docs) {
          let badgeRecord = snapshot.docs[0].data()
          if (badgeRecord.ownerId === user.uid) {
            return axios
              .post(blockchain.server + '/addNonFungibleToEscrowWithSignatureRelay', postData)
              .then(async (response) => {
                if (response && response.data && response.data.success) {
                  // do we make a new badge sale here? probably. then we will delete the badge from user profile on purchase
                  let badgeDoc = Object.assign(badgeRecord, {
                    currency: user.currency,
                    price: price,
                    removedFromShowcase: false,
                    soldout: false,
                    sold: 0,
                    shares: 0,
                    likes: 0,
                    supply: 1,
                    id: snapshot.docs[0].id,
                    uri: 'https://showcase.to/badge/' + snapshot.docs[0].id,
                    resale: true,
                    resaleUser: user.uid,
                    resaleUsername: user.username,
                  })

                  return db
                    .collection('badgesales')
                    .add(badgeDoc)
                    .then((docRef) => {
                      // here we need to set forSale = true in the original badge doc and set saleId = the bade sale doc id
                      return db
                        .collection('badges')
                        .doc(badgeid)
                        .update({ forSale: true, saleid: docRef.id })
                        .then((done) => {
                          return res.json({ success: true })
                        })
                        .catch((err) => {
                          console.log('Err list badge 6', err)
                          return res.status(422).send({ error: err })
                        })
                    })
                    .catch((err) => {
                      console.log('Err list badge 6', err)
                      return res.status(422).send({ error: err })
                    })
                } else {
                  console.log('Err list badge 5')
                  return res.status(422).send({ error: 'Error' })
                }
              })
              .catch((err) => {
                console.log('Err list badge 4', err)
                return res.status(422).send({ error: err })
              })
          } else {
            // console.log('Err list badge 3', err)
            return res.status(422).send({ error: 'Error' })
          }
        } else {
          //   console.log('Err list badge 2', err)
          return res.status(422).send({ error: 'Error' })
        }
      })
      .catch((err) => {
        console.log('Err list badge 1', err)
        return res.status(422).send({ error: err })
      })
  }
}
