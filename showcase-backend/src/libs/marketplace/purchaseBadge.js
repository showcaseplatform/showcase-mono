/* eslint-disable promise/no-nesting */
const axios = require('axios')
const { firestore: db, FieldValue } = require('../../services/firestore')
const { blockchain } = require('../../config')
const stripe = require('../../services/stripe')

module.exports = async (req, res) => {
  const { itemId, currencyRate, displayedPrice } = req.body
  const { user } = req
  console.log('BOUGHT BADGE', user.crypto)
  if ((user.spent > 1000 && !user.kycVerified) || (user.kycVerified && user.spent > 10000)) {
    return res.status(422).send({
      error:
        'You have reached the maximum spending limit. Please contact team@showcase.to to increase your limits.',
    })
  } else if (user.crypto && user.crypto.address && user.stripeId) {
    try {
      let existingBadge = await db
        .collection('badges')
        .where('saleId', '==', itemId)
        .where('ownerId', '==', user.uid)
        .get()
      if (existingBadge.exists) {
        console.log(existingBadge.exists, 'EXISTING BADGE EXISTS!!!')
        return res.status(422).send({ error: 'You already purchased this badge' })
      }
    } catch (err) {
      console.log('Error checking if badge exists')
      return res.status(422).send({ error: err })
    }

    let badgeSaleRef = db.collection('badgesales').doc(itemId)

    db.collection('currencyrates')
      .doc('rates')
      .get()
      .then((currencyDoc) => {
        console.log('Updated currency rates data')
        if (!currencyDoc.exists) {
          return res.status(422).send({ error: 'empty currencies' })
        } else {
          let currenciesData = currencyDoc.data()

          return db
            .runTransaction((t) => {
              return t.get(badgeSaleRef).then(async (doc) => {
                if (doc.data().sold < doc.data().supply) {
                  let sold = doc.data().sold + 1

                  let newLastDigits = (parseInt(doc.data().tokenType.slice(-10)) + sold).toFixed(0)

                  while (newLastDigits.length < 10) {
                    console.log('ADDING 0')
                    newLastDigits = '0' + newLastDigits
                  }

                  let newBadgeTokenId = doc.data().tokenType.slice(0, -10) + newLastDigits

                  console.log(
                    'NEW BADGE ID-',
                    newLastDigits.length,
                    doc.data().tokenType,
                    doc.data().tokenType.slice(-10),
                    doc.data().tokenType.slice(0, -10),
                    newLastDigits,
                    newBadgeTokenId
                  )

                  let multiplier =
                    (1 / currenciesData[doc.data().currency]) * currenciesData[user.currency]
                  let calculatedPrice = parseFloat((doc.data().price * multiplier).toFixed(2))
                  console.log(
                    'PRICE CURRENCY DATA',
                    doc.data().price,
                    doc.data().currency,
                    user.currency,
                    currenciesData[user.currency],
                    currenciesData[user.currency],
                    calculatedPrice
                  )
                  if (doc.data().price === 0 || calculatedPrice === displayedPrice) {
                    //make sure currency conversion rates are the same
                    if (currenciesData[user.currency] === currencyRate) {
                      t.update(badgeSaleRef, { sold })
                      //return Promise.resolve({doc:doc.data(), newBadgeTokenId, edition:sold});
                      const twoDecimalCurrencyMultiplier = 100

                      let refundChargeId = ''
                      try {
                        const charge = await stripe.charges.create({
                          amount: calculatedPrice * twoDecimalCurrencyMultiplier,
                          currency: user.currency,
                          customer: user.stripeId,
                          description:
                            'Showcase Badge "' +
                            doc.data().title +
                            '" (ID: ' +
                            newBadgeTokenId +
                            ')',
                          metadata: {
                            badgeid: newBadgeTokenId,
                            badgename: doc.data().title,
                            creatorid: doc.data().creatorId,
                          },
                          //receipt_email: user.email || null, //avoid email for now..
                        })
                        console.log('STRIPE CHARGE', charge)
                        if (!charge || !charge.id || !charge.paid) {
                          return Promise.reject(new Error('Unable to create charge'))
                        } else {
                          const data = {
                            to: [user.crypto.address],
                            type: newBadgeTokenId,
                            token: blockchain.authToken,
                          }

                          return axios
                            .post(blockchain.server + '/mintBadge', data)
                            .then(async (response) => {
                              console.log('transfer badge response', response.data)
                              if (response.data.success) {
                                // now we make the new badge document to display in their feed
                                let newBadgeDoc = {
                                  uri: doc.data().uri,
                                  saleId: doc.data().id,
                                  title: doc.data().title,
                                  description: doc.data().description,
                                  creatorName: doc.data().creatorName,
                                  image: doc.data().image,
                                  imageHash: doc.data().imageHash,
                                  supply: doc.data().supply,
                                  creatorAddress: doc.data().creatorAddress,
                                  creatorId: doc.data().creatorId,
                                  createdDate: doc.data().createdDate,
                                  edition: sold,
                                  tokenId: newBadgeTokenId,
                                  tokenType: doc.data().tokenType,
                                  ownerAddress: user.crypto.address,
                                  category: doc.data().category,
                                  ownerId: user.uid,
                                  purchasedDate: new Date(),
                                  donationAmount: doc.data().donationAmount || 0,
                                  donationCause: doc.data().donationCause || 'None',
                                  views: 0,
                                  likes: 0,
                                  shares: 0,
                                  removedFromShowcase: false,
                                  lastViewed: new Date(),
                                }

                                if (doc.data().donationAmount && doc.data().donationAmount > 0) {
                                  try {
                                    let foundCause = await db
                                      .collection('causes')
                                      .where('site', '==', doc.data().donationCause)
                                      .limit(1)
                                      .get()
                                    if (!foundCause.empty) {
                                      newBadgeDoc.donationCause = foundCause.docs[0].data().site
                                      newBadgeDoc.donationCauseImage = foundCause.docs[0].data().image
                                      newBadgeDoc.donationCauseName = foundCause.docs[0].data().name
                                      newBadgeDoc.donationAmount = doc.data().donationAmount
                                    }
                                  } catch (e) {
                                    console.log('ERR FINDING CAUSE', e)
                                  }
                                }

                                return db
                                  .collection('badges')
                                  .doc(newBadgeTokenId)
                                  .set(newBadgeDoc)
                                  .then((done) => {
                                    console.log('Updated badge data', done)

                                    // insert receipt, should track blockchain transaction hash, stripe payment hash, and payouts amounts.

                                    let receiptData = {
                                      saleId: doc.data().id,
                                      badgeToken: newBadgeTokenId,
                                      transactionHash: response.data.transactionHash,
                                      salePrice: doc.data().price,
                                      saleCurrency: doc.data().currency,
                                      convertedPrice: calculatedPrice,
                                      convertedCurrency: user.currency,
                                      convertedRate: currenciesData[user.currency],
                                      donationAmount: doc.data().donationAmount || 0,
                                      chargeId: charge.id,
                                      created: new Date(),
                                      user: user.uid,
                                      creator: doc.data().creatorId,
                                    }

                                    console.log('RECEIPT DATA', receiptData)

                                    db.collection('receipts')
                                      .doc(doc.data().id)
                                      .set(receiptData)
                                      .then((done) => {
                                        return true
                                      })
                                      .catch((err) => {
                                        console.log('ERROR creating receipt', err)
                                        return true
                                      })

                                    if (doc.data().price > 0) {
                                      let USDmultiplier = 1 / currenciesData[doc.data().currency]
                                      let USDPrice = parseFloat(
                                        (doc.data().price * USDmultiplier).toFixed(2)
                                      )

                                      let updateData = {
                                        badgesCount: FieldValue.increment(1),
                                        spent: FieldValue.increment(USDPrice),
                                      }
                                      let totalPrice = doc.data().price
                                      let feeMultiplier = 0.9
                                      let causeFullAmount = 0

                                      if (doc.data().donationAmount) {
                                        feeMultiplier -= doc.data().donationAmount
                                        causeFullAmount = doc.data().donationAmount * totalPrice
                                      }

                                      let payoutAmount = totalPrice * feeMultiplier

                                      if (doc.data().currency === 'USD') {
                                        updateData['balances.usd'] = FieldValue.increment(
                                          payoutAmount
                                        )
                                      } else if (doc.data().currency === 'EUR') {
                                        updateData['balances.eur'] = FieldValue.increment(
                                          payoutAmount
                                        )
                                      } else if (doc.data().currency === 'GBP') {
                                        updateData['balances.gbp'] = FieldValue.increment(
                                          payoutAmount
                                        )
                                      }

                                      // we will have to update the cause document to increment the cause benefit amount.
                                      if (causeFullAmount && causeFullAmount > 0) {
                                        let updateCause = {
                                          contributionsAmount: FieldValue.increment(1),
                                        }

                                        if (doc.data().currency === 'USD') {
                                          updateCause['balances.usd'] = FieldValue.increment(
                                            causeFullAmount
                                          )
                                        } else if (doc.data().currency === 'EUR') {
                                          updateCause['balances.eur'] = FieldValue.increment(
                                            causeFullAmount
                                          )
                                        } else if (doc.data().currency === 'GBP') {
                                          updateCause['balances.gbp'] = FieldValue.increment(
                                            causeFullAmount
                                          )
                                        }

                                        console.log(
                                          'UPDATING CAUSE',
                                          doc.data().donationCauseId,
                                          updateCause
                                        )

                                        db.collection('causes')
                                          .doc(doc.data().donationCauseId)
                                          .update(updateCause)
                                          .then((done) => {
                                            console.log('Updated cause balance')
                                            return true
                                          })
                                          .catch((err) => {
                                            console.log('ERROR updating cause balance!!', err)
                                            return true
                                          })
                                      }

                                      console.log('UPDATING USER', updateData)

                                      db.collection('users')
                                        .doc(user.uid)
                                        .update(updateData)
                                        .then((done) => {
                                          console.log('Updated profile')
                                          return true
                                        })
                                        .catch((err) => {
                                          console.log('ERROR updating user balance!!', err)
                                          return true
                                        })
                                    }

                                    if (sold === doc.data().supply) {
                                      console.log('SETTING SOLDout=true')
                                      db.collection('badgesales')
                                        .doc(itemId)
                                        .update({ soldout: true })
                                        .then((done) => {
                                          return true
                                        })
                                        .catch((err) => {
                                          console.log('ERROR SETTING IT SOLOUT', err)
                                          return true
                                        })
                                    }

                                    //sendNotification(doc.data().creatorId, "Badge Sale", "You sold a badge: "+doc.data().title, userdoc.data().notificationToken);

                                    return Promise.resolve(true)
                                  })
                                  .catch(async (err) => {
                                    try {
                                      let refund = await stripe.refunds.create({
                                        charge: charge.id,
                                      })
                                      console.log('REFUNDED CHARGE1', refund)
                                    } catch (err) {
                                      console.log('UNABLE TO REFUND CUSTOMER1')
                                    }
                                    console.log('ERR creating badge', err)

                                    return Promise.reject(new Error('Error creating badge'))
                                  })
                              } else {
                                console.log('BLOCKCHAIN ERR MISSING PARAMS')
                                try {
                                  let refund = await stripe.refunds.create({ charge: charge.id })
                                  console.log('REFUNDED CHARGE2', refund)
                                } catch (err) {
                                  console.log('UNABLE TO REFUND CUSTOMER2')
                                }
                                return Promise.reject(new Error('Missing response parameters'))
                              }
                            })
                            .catch(async (error) => {
                              console.log('BLOCKCHAIN ERR RECEIEVD', error)
                              try {
                                let refund = await stripe.refunds.create({ charge: charge.id })
                                console.log('REFUNDED CHARGE3', refund)
                              } catch (err) {
                                console.log('UNABLE TO REFUND CUSTOMER3')
                              }
                              return Promise.reject(new Error('Error connecting to Blockchain'))
                            })
                        }
                        /*}).catch((err) => {
                                                console.log("Stripe err");
                                                return Promise.reject(new Error(err));
                                            });*/
                      } catch (err) {
                        console.log('Stripe err', err)
                        return Promise.reject(new Error(err))
                      }
                    } else {
                      return Promise.reject(new Error('currencies'))
                    }
                  } else {
                    console.log(
                      'MISMATCHING PRICES',
                      doc.data().price,
                      calculatedPrice,
                      displayedPrice
                    )
                    return Promise.reject(new Error('Wrong price displayed'))
                  }
                } else {
                  console.log('Sold out', doc.data().sold, doc.data().supply)
                  return Promise.reject(new Error('Out of stock'))
                }
              })
            })
            .then((result) => {
              console.log('Transaction success', result)
              return res.send('OK')
              // do blockchain transfer
            })
            .catch((err) => {
              console.log('Transaction failure:', err)
              return res.status(422).send({ error: err.toString() })
            })
        }
      })
      .catch((err) => {
        console.log('currency loading err', err)
        return res.status(422).send({ error: err })
      })
  } else {
    return res.status(422).send({ error: 'No wallet or card' })
  }
}
