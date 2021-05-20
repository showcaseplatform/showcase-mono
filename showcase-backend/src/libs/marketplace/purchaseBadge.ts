/* eslint-disable promise/no-nesting */
import axios from 'axios'
import { firestore as db, FieldValue } from '../../services/firestore'
import { blockchain } from '../../config'
import { stripe } from '../../services/stripe'
import { Uid } from '../../types/user'
import Boom from 'boom'
import { BadgeDocumentData, SalesBadge } from '../../types/badge'

const checkIfBadgeOwnedByUser = async (uid: Uid, itemId: string) => {
  const existingBadge = await db
    .collection('badges')
    .where('saleId', '==', itemId)
    .where('ownerId', '==', uid)
    .get()
  if (!existingBadge.empty) {
    throw Boom.preconditionFailed('You already purchased this badge')
  }
}

const getCurrencyRates = async () => {
  const currencyDoc = await db.collection('currencyrates').doc('rates').get()
  if (!currencyDoc.exists) {
    throw Boom.notFound('Empty currencies')
  }
  return currencyDoc.data()
}

const constructNewTokenId = (badge: SalesBadge, newSoldAmount: number) => {
  let newLastDigits = (parseInt(badge.tokenType.slice(-10)) + newSoldAmount).toFixed(0)

  while (newLastDigits.length < 10) {
    newLastDigits = '0' + newLastDigits
  }

  return badge.tokenType.slice(0, -10) + newLastDigits
}

export const purchaseBadge = async (req: any, res: any) => {
  const { itemId, currencyRate, displayedPrice } = req.body
  const { user } = req

  if ((user.spent > 1000 && !user.kycVerified) || (user.kycVerified && user.spent > 10000)) {
    throw Boom.preconditionFailed(
      'You have reached the maximum spending limit. Please contact team@showcase.to to increase your limits.'
    )
  } else if (user.crypto && user.crypto.address && user.stripeId) {
    await checkIfBadgeOwnedByUser(user.uid, itemId)

    const badgeSaleRef = db.collection('badgesales').doc(itemId)

    const currenciesData = (await getCurrencyRates()) as any

    // const t = await db.runTransaction((t) => t.get(badgeSaleRef))

    return db
      .runTransaction((t) => {
        return t.get(badgeSaleRef).then(async (doc) => {

          const salesBadge = doc.data() as SalesBadge
          if (salesBadge.sold === salesBadge.supply) {
            throw Boom.preconditionFailed('Out of stock')
          }

          const newSoldAmount = salesBadge.sold + 1
          const newBadgeTokenId = constructNewTokenId(salesBadge, newSoldAmount)

          const multiplier =
            (1 / currenciesData[salesBadge.currency]) * currenciesData[user.currency]
          const calculatedPrice = parseFloat((salesBadge.price * multiplier).toFixed(2))

          if (salesBadge.price === 0 || calculatedPrice === displayedPrice) {
            //make sure currency conversion rates are the same
            if (currenciesData[user.currency] === currencyRate) {
              t.update(badgeSaleRef, { sold: newSoldAmount })
              //return Promise.resolve({doc:doc.data(), newBadgeTokenId, edition:sold});
              const twoDecimalCurrencyMultiplier = 100

              let refundChargeId = ''
              try {
                const charge = await stripe.charges.create({
                  amount: calculatedPrice * twoDecimalCurrencyMultiplier,
                  currency: user.currency,
                  customer: user.stripeId,
                  description:
                    'Showcase Badge "' + salesBadge.title + '" (ID: ' + newBadgeTokenId + ')',
                  metadata: {
                    badgeid: newBadgeTokenId,
                    badgename: salesBadge.title,
                    creatorid: salesBadge.creatorId,
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
                        let newBadgeDoc: BadgeDocumentData = {
                          uri: salesBadge.uri,
                          saleId: salesBadge.id,
                          title: salesBadge.title,
                          description: salesBadge.description,
                          creatorName: salesBadge.creatorName,
                          image: salesBadge.image,
                          imageHash: salesBadge.imageHash,
                          supply: salesBadge.supply,
                          creatorAddress: salesBadge.creatorAddress,
                          creatorId: salesBadge.creatorId,
                          createdDate: salesBadge.createdDate,
                          edition: newSoldAmount,
                          tokenId: newBadgeTokenId,
                          tokenType: salesBadge.tokenType,
                          ownerAddress: user.crypto.address,
                          category: salesBadge.category,
                          ownerId: user.uid,
                          purchasedDate: new Date(),
                          donationAmount: salesBadge.donationAmount || 0,
                          donationCause: salesBadge.donationCause || 'None',
                          views: 0,
                          likes: 0,
                          shares: 0,
                          removedFromShowcase: false,
                          lastViewed: new Date(),
                        }

                        if (salesBadge.donationAmount && salesBadge.donationAmount > 0) {
                          try {
                            let foundCause = await db
                              .collection('causes')
                              .where('site', '==', salesBadge.donationCause)
                              .limit(1)
                              .get()
                            if (!foundCause.empty) {
                              newBadgeDoc.donationCause = foundCause.docs[0].data().site
                              newBadgeDoc.donationCauseImage = foundCause.docs[0].data().image
                              newBadgeDoc.donationCauseName = foundCause.docs[0].data().name
                              newBadgeDoc.donationAmount = salesBadge.donationAmount
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
                              saleId: salesBadge.id,
                              badgeToken: newBadgeTokenId,
                              transactionHash: response.data.transactionHash,
                              salePrice: salesBadge.price,
                              saleCurrency: salesBadge.currency,
                              convertedPrice: calculatedPrice,
                              convertedCurrency: user.currency,
                              convertedRate: currenciesData[user.currency],
                              donationAmount: salesBadge.donationAmount || 0,
                              chargeId: charge.id,
                              created: new Date(),
                              user: user.uid,
                              creator: salesBadge.creatorId,
                            }

                            console.log('RECEIPT DATA', receiptData)

                            db.collection('receipts')
                              .doc(salesBadge.id)
                              .set(receiptData)
                              .then((done) => {
                                return true
                              })
                              .catch((err) => {
                                console.log('ERROR creating receipt', err)
                                return true
                              })

                            if (salesBadge.price > 0) {
                              let USDmultiplier = 1 / currenciesData[salesBadge.currency]
                              let USDPrice = parseFloat(
                                (salesBadge.price * USDmultiplier).toFixed(2)
                              )

                              let updateData = {
                                badgesCount: FieldValue.increment(1),
                                spent: FieldValue.increment(USDPrice),
                              }
                              let totalPrice = salesBadge.price
                              let feeMultiplier = 0.9
                              let causeFullAmount = 0

                              if (salesBadge.donationAmount) {
                                feeMultiplier -= salesBadge.donationAmount
                                causeFullAmount = salesBadge.donationAmount * totalPrice
                              }

                              let payoutAmount = totalPrice * feeMultiplier

                              if (salesBadge.currency === 'USD') {
                                updateData['balances.usd'] = FieldValue.increment(payoutAmount)
                              } else if (salesBadge.currency === 'EUR') {
                                updateData['balances.eur'] = FieldValue.increment(payoutAmount)
                              } else if (salesBadge.currency === 'GBP') {
                                updateData['balances.gbp'] = FieldValue.increment(payoutAmount)
                              }

                              // we will have to update the cause document to increment the cause benefit amount.
                              if (causeFullAmount && causeFullAmount > 0) {
                                let updateCause = {
                                  contributionsAmount: FieldValue.increment(1),
                                }

                                if (salesBadge.currency === 'USD') {
                                  updateCause['balances.usd'] = FieldValue.increment(
                                    causeFullAmount
                                  )
                                } else if (salesBadge.currency === 'EUR') {
                                  updateCause['balances.eur'] = FieldValue.increment(
                                    causeFullAmount
                                  )
                                } else if (salesBadge.currency === 'GBP') {
                                  updateCause['balances.gbp'] = FieldValue.increment(
                                    causeFullAmount
                                  )
                                }

                                console.log(
                                  'UPDATING CAUSE',
                                  salesBadge.donationCauseId,
                                  updateCause
                                )

                                db.collection('causes')
                                  .doc(salesBadge.donationCauseId)
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

                            if (newSoldAmount === salesBadge.supply) {
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

                            //sendNotification(salesBadge.creatorId, "Badge Sale", "You sold a badge: "+salesBadge.title, usersalesBadge.notificationToken);

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
              } catch (err) {
                console.log('Stripe err', err)
                return Promise.reject(new Error(err))
              }
            } else {
              return Promise.reject(new Error('currencies'))
            }
          } else {
            console.log('MISMATCHING PRICES', salesBadge.price, calculatedPrice, displayedPrice)
            return Promise.reject(new Error('Wrong price displayed'))
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
  } else {
    return res.status(422).send({ error: 'No wallet or card' })
  }
}
