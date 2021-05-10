/* eslint-disable promise/no-nesting */
const axios = require('axios')
const { firestore: db } = require('../../services/firestore')
const { blockchain } = require('../../config')
const { sendNotificationToFollowersAboutNewBadge } = require('../../notifications/newBadgePublished')

module.exports = async (req, res) => {
  const { user } = req
  if (!user.creator) {
    return res.status(422).send({ error: 'You are not a verified creator' })
  }

  let {
    title,
    price,
    quantity,
    description,
    id,
    image,
    imagehash,
    category,
    donationamount,
    donationcause,
    gif,
  } = req.body

  if (title.length > 20 || title.length === 0) {
    return res.status(422).send({ error: 'Invalid Title Length' })
  } else if (price < 0 || price > 200 || isNaN(price) || typeof price !== 'number') {
    return res.status(422).send({ error: 'Invalid Price' })
  } else if (
    quantity < 1 ||
    quantity > 1000000 ||
    isNaN(quantity) ||
    typeof quantity !== 'number'
  ) {
    return res.status(422).send({ error: 'Invalid Quantity' })
  } else if (!image || image.length === 0) {
    return res.status(422).send({ error: 'Invalid Image' })
  } else if (description && description.length > 240) {
    return res.status(422).send({ error: 'Invalid Description' })
  } else if (donationamount && (donationamount < 0.05 || donationamount > 0.5)) {
    return res.status(422).send({ error: 'Invalid Donation Amount' })
  } else {
    let foundDonationSite = 'None'
    let foundDonationImage = 'None'
    let foundDonationName = 'None'
    let foundDonationId = 'None'
    let foundDonationAmount = 0
    var foundCause
    if (donationcause && donationcause.length && donationcause.length > 0) {
      try {
        foundCause = await db.collection('causes').where('site', '==', donationcause).limit(1).get()

        console.log('UID?', foundCause.docs[0].id)
        if (!foundCause.empty) {
          foundDonationSite = foundCause.docs[0].data().site
          foundDonationImage = foundCause.docs[0].data().image
          foundDonationName = foundCause.docs[0].data().name
          foundDonationId = foundCause.docs[0].id
          foundDonationAmount = donationamount
        } else {
          console.log('Could not find cause ', donationcause)
        }
      } catch (e) {
        console.log('ERR FINDING CAUSE', e)
      }
    }

    const data = {
      token: blockchain.authToken,
      uri: 'https://showcase.to/badge/' + id,
      name: title,
      description: description || 'None',
      creatorname: user.username,
      category: category.toLowerCase(),
      image,
      imagehash,
      supply: quantity,
      creatoraddress: user.crypto.address,
      //causeSite: foundDonationSite,
      //causeAmount: foundDonationAmount,
    }

    console.log('PUBLISH BADGE DATA OBJ', data)

    axios
      .post(blockchain.server + '/createBadge', data)
      .then((response) => {
        try {
          console.log('data from blockchain server', response.data)
          if (response.data.tokenType) {
            const badgeDoc = {
              uri: 'https://showcase.to/badge/' + id,
              id: id,
              title,
              description,
              creatorName: user.username,
              category: category.toLowerCase(),
              image,
              price,
              currency: user.currency,
              imageHash: imagehash,
              supply: quantity,
              creatorAddress: user.crypto.address,
              creatorId: user.uid,
              createdDate: new Date(),
              sold: 0,
              tokenType: response.data.tokenType,
              views: 0,
              likes: 0,
              shares: 0,
              soldout: false,
              forSale: false,
              removedFromShowcase: false,
              donationAmount: foundDonationAmount,
              donationCause: foundDonationSite,
              donationCauseImage: foundDonationImage,
              donationCauseName: foundDonationName,
              donationCauseId: foundDonationId,
              gif,
            }
            return db
              .collection('badgesales')
              .doc(id)
              .set(badgeDoc)
              .then(async (docRef) => {
                console.log('Updated badge data')
                await sendNotificationToFollowersAboutNewBadge(user.id)
                return res.json({ badgeSaleId: docRef.id })
              })
              .catch((err) => {
                return res.status(422).send({ error: err })
              })
          } else {
            console.log('BLOCKCHAIN ERR MISSING PARAMS')
            return res.status(422).send({ error: 'ERR MISSING RESPONSE PARAMS' })
          }
        } catch (e) {
          console.log(e)
          return res.status(422).send({ error: 'ERR INVALID PARAMS' })
        }
      })
      .catch((error) => {
        console.log('BLOCKCHAIN ERR RECEIEVD', error.response.data)
        return res.status(422).send({ error: 'ERR INVALID PARAMS' })
      })
  }
}
