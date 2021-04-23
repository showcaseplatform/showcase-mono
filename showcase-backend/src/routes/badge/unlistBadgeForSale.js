/* eslint-disable promise/no-nesting */
const axios = require('axios')
const { firestore: db } = require('../../services/firestore')
const { blockchainServer } = require('../../config')

module.exports = async (req, res) => {
  let user = req.user.data()

  let { badgeid } = req.body

  // here we need to make sure user currently owns the badge because the removebadge is called from escrow
  db.collection('badges')
    .where('tokenId' === badgeid)
    .get()
    .then((snapshot) => {
      if (snapshot.docs) {
        let badgeRecord = snapshot.docs[0].data()
        if (badgeRecord.ownerId === user.uid) {
          return axios
            .post(blockchainServer + '/removeBadgeFromEscrow', { badgeid })
            .then(async  (response) => {
              if (response && response.data && response.data.success) {
                // now we need to delete the badge sale for this listing
                return db
                  .collection('badges')
                  .where('tokenId' === badgeid)
                  .delete()
                  .then(() => {
                    return res.json({ success: true })
                  })
                  .catch((err) => {
                    console.log('Err unlist badge 5', err)
                    return res.status(422).send({ error: err })
                  })
              } else {
                console.log('Err unlist badge 4')
                return res.status(422).send({ error: 'Error' })
              }
            })
            .catch((err) => {
              return res.status(422).send({ error: err })
            })
        } else {
          console.log('Err unlist badge 3')
          return res.status(422).send({ error: 'Error' })
        }
      } else {
        console.log('Err unlist badge 2')
        return res.status(422).send({ error: 'Error' })
      }
    })
    .catch((err) => {
      console.log('Err unlist badge 1', err)
      return res.status(422).send({ error: err })
    })
}
