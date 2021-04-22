/* eslint-disable promise/no-nesting */
const { transferWise } = require('../../config')
const axios = require('axios')
const admin = require('firebase-admin')
const db = admin.firestore()
let FieldValue = admin.firestore.FieldValue

const moment = require('moment')
const { v4: uuidv4 } = require('uuid')

module.exports = (req, res) => {
  let user = req.user.data()
  const originalBalance = user.balances[req.body.currency.toLowerCase()]
  //minmum 20 usd/eur/gbp withdrawal
  if (
    req.body.amount &&
    req.body.currency &&
    !user.kycVerified &&
    parseFloat(req.body.amount) >
      500 /*|| (user.kycVerified && parseFloat(req.body.amount) > 2000)*/
  ) {
    //500 USD, GBP or EU
    return res
      .status(422)
      .send({ error: 'Please contact Showcase support to increase your withdrawal limits.' })
  } else if (
    user.recentWithdrawalDate &&
    user.recentWithdrawalAmount &&
    moment(new Date()).diff(moment(user.recentWithdrawalDate.toDate()), 'hours') <= 24 &&
    !user.kycVerified &&
    parseFloat(req.body.amount) + user.recentWithdrawalAmount >
      500 /*|| (user.kycVerified && (parseFloat(req.body.amount) + user.recentWithdrawalAmount) > 2000)*/
  ) {
    console.log(
      'TIEM DIFF',
      moment(new Date()).diff(moment(user.recentWithdrawalDate), 'hours'),
      user.recentWithdrawalDate,
      user.recentWithdrawalDate.toDate()
    )
    return res
      .status(422)
      .send({ error: 'Please contact Showcase support to increase your withdrawal limits.' })
  } else if (
    req.body.amount &&
    parseFloat(req.body.amount) > 20 &&
    req.body.currency &&
    user.balances[req.body.currency.toLowerCase()] &&
    user.balances[req.body.currency.toLowerCase()] >= parseFloat(req.body.amount)
  ) {
    axios({
      method: 'post',
      url: 'https://api.sandbox.transferwise.tech/v1/quotes',
      data: {
        profile: transferWise.profile,
        source: 'EUR',
        target: req.body.currency,
        rateType: 'FIXED',
        targetAmount: parseFloat(req.body.amount),
        type: 'BALANCE_PAYOUT',
      },
      headers: {
        Authorization: `Bearer ${transferWise.token}`,
      },
    })
      .then((quoteResponse) => {
        if (quoteResponse && quoteResponse.data && quoteResponse.data.id) {
          let updateObj = {}
          updateObj['balances.' + req.body.currency.toLowerCase()] = FieldValue.increment(
            -parseFloat(req.body.amount)
          )

          console.log('BALANCE UPD', updateObj)
          if (
            !user.recentWithdrawalDate ||
            moment(new Date()).diff(moment(user.recentWithdrawalDate.toDate()), 'hours') > 24
          ) {
            updateObj.recentWithdrawalDate = new Date()
            updateObj.recentWithdrawalAmount = parseFloat(req.body.amount)
          } else {
            updateObj.recentWithdrawalAmount = FieldValue.increment(parseFloat(req.body.amount))
          }

          let transferwiseId = user['transferwiseId' + req.body.currency.toUpperCase()]

          return db
            .collection('users')
            .doc(user.uid)
            .update(updateObj)
            .then((updateresult) => {
              return db
                .collection('users')
                .doc(user.uid)
                .get()
                .then((userdoc) => {
                  if (
                    userdoc.data() &&
                    userdoc.data().balances &&
                    userdoc.data().balances[req.body.currency.toLowerCase()] >= 0
                  ) {
                    //continue
                    //console.log("After deducting withdrawal amount user had >= 0 balance, so we proceed with withdrawal. amount:", userdoc.data().balances[req.body.currency.toLowerCase()]);

                    let customerTransactionId = uuidv4()

                    return axios({
                      method: 'post',
                      url: 'https://api.sandbox.transferwise.tech/v1/transfers',
                      data: {
                        customerTransactionId: customerTransactionId,
                        quote: quoteResponse.data.id,
                        targetAccount: transferwiseId,
                        details: {
                          reference: 'Showcase',
                          transferPurpose: 'verification.transfers.purpose.other',
                          transferPurposeOther: 'Showcase Payout',
                          sourceOfFunds: 'verification.source.of.funds.other',
                          sourceOfFundsOther: 'Showcase badge sales',
                        },
                      },
                      headers: {
                        Authorization: `Bearer ${transferWise.token}`,
                      },
                    })
                      .then((transferResponse) => {
                        if (transferResponse && transferResponse.data && transferResponse.data.id) {
                          return axios({
                            method: 'post',
                            url:
                              'https://api.sandbox.transferwise.tech/v3/profiles/' +
                              transferWise.profile +
                              '/transfers/' +
                              transferResponse.data.id +
                              '/payments',
                            data: {
                              type: 'BALANCE',
                            },
                            headers: {
                              Authorization: `Bearer ${transferWise.token}`,
                            },
                          })
                            .then((fundResponse) => {
                              if (
                                fundResponse &&
                                fundResponse.data &&
                                fundResponse.data.status &&
                                fundResponse.data.status === 'COMPLETED'
                              ) {
                                // now get ETA for withdrawal receipt to show user.

                                axios({
                                  method: 'get',
                                  url:
                                    'https://api.sandbox.transferwise.tech/v1/delivery-estimates/' +
                                    transferResponse.data.id,
                                  headers: {
                                    Authorization: `Bearer ${transferWise.token}`,
                                  },
                                })
                                  .then((etaResponse) => {
                                    if (
                                      etaResponse &&
                                      etaResponse.data &&
                                      etaResponse.data.estimatedDeliveryDate
                                    ) {
                                      let withdrawalData = {
                                        user: user.uid,
                                        created: new Date(),
                                        customerTransactionId: customerTransactionId,
                                        transactionId: transferResponse.data.id,
                                        quote: quoteResponse.data.id,
                                        targetAccount: transferwiseId,
                                        amount: req.body.amount,
                                        currency: req.body.currency,
                                        success: true,
                                        eta: new Date(etaResponse.data.estimatedDeliveryDate),
                                      }
                                      return db
                                        .collection('withdrawals')
                                        .add(withdrawalData)
                                        .then((done) => {
                                          return true
                                        })
                                        .catch((err) => {
                                          console.log('ERROR creating receipt', err)
                                          return true
                                        })
                                    } else {
                                      let withdrawalData = {
                                        user: user.uid,
                                        created: new Date(),
                                        customerTransactionId: customerTransactionId,
                                        transactionId: transferResponse.data.id,
                                        quote: quoteResponse.data.id,
                                        targetAccount: transferwiseId,
                                        amount: req.body.amount,
                                        currency: req.body.currency,
                                        success: true,
                                      }
                                      return db
                                        .collection('withdrawals')
                                        .add(withdrawalData)
                                        .then((done) => {
                                          return true
                                        })
                                        .catch((err) => {
                                          console.log('ERROR creating receipt', err)
                                          return true
                                        })
                                    }
                                  })
                                  .catch((err) => {
                                    console.log('ERR ', err)
                                    let withdrawalData = {
                                      user: user.uid,
                                      created: new Date(),
                                      customerTransactionId: customerTransactionId,
                                      transactionId: transferResponse.data.id,
                                      quote: quoteResponse.data.id,
                                      targetAccount: transferwiseId,
                                      amount: req.body.amount,
                                      currency: req.body.currency,
                                      success: true,
                                    }
                                    return db
                                      .collection('withdrawals')
                                      .add(withdrawalData)
                                      .then((done) => {
                                        return true
                                      })
                                      .catch((err) => {
                                        console.log('ERROR creating receipt', err)
                                        return true
                                      })
                                  })

                                return res.send('OK')
                              } else {
                                //first put back balance to user.
                                let updateObjError = {
                                  recentWithdrawalAmount: FieldValue.increment(
                                    -parseFloat(req.body.amount)
                                  ),
                                }
                                updateObjError[
                                  'balances.' + req.body.currency.toLowerCase()
                                ] = FieldValue.increment(parseFloat(req.body.amount))
                                db.collection('users')
                                  .doc(user.uid)
                                  .update(updateObjError)
                                  .then((done) => {
                                    return true
                                  })
                                  .catch((err) => {
                                    console.log('ERR restoring user balance', err)
                                    return true
                                  })
                                // now we will create a withdrawalreceipt with a failed status.
                                let withdrawalData = {
                                  user: user.uid,
                                  created: new Date(),
                                  customerTransactionId: customerTransactionId,
                                  transactionId: transferResponse.data.id,
                                  quote: quoteResponse.data.id,
                                  targetAccount: transferwiseId,
                                  amount: req.body.amount,
                                  currency: req.body.currency,
                                  error: fundResponse.data.errorCode || 'Unknown error (step 3)',
                                }
                                db.collection('withdrawals')
                                  .add(withdrawalData)
                                  .then((done) => {
                                    return true
                                  })
                                  .catch((err) => {
                                    console.log('ERROR creating receipt', err)
                                    return true
                                  })

                                return res.status(422).send({
                                  error:
                                    fundResponse.data.errorCode ||
                                    'Error processing payment to your account',
                                })
                              }
                            })
                            .catch((err) => {
                              let updateObjError = {
                                recentWithdrawalAmount: FieldValue.increment(
                                  -parseFloat(req.body.amount)
                                ),
                              }
                              updateObjError.balances[
                                req.body.currency.toLowerCase()
                              ] = FieldValue.increment(parseFloat(req.body.amount))
                              db.collection('users')
                                .doc(user.uid)
                                .update(updateObjError)
                                .then((done) => {
                                  return true
                                })
                                .catch((err) => {
                                  console.log('ERR restoring user balance', err)
                                  return true
                                })
                              // now we will create a withdrawalreceipt with a failed status.
                              let withdrawalData = {
                                user: user.uid,
                                created: new Date(),
                                customerTransactionId: customerTransactionId,
                                quote: quoteResponse.data.id,
                                targetAccount: transferwiseId,
                                transactionId: transferResponse.data.id,
                                amount: req.body.amount,
                                currency: req.body.currency,
                                error: err.toString() + '#2',
                              }
                              db.collection('withdrawals')
                                .add(withdrawalData)
                                .then((done) => {
                                  return true
                                })
                                .catch((err) => {
                                  console.log('ERROR creating receipt', err)
                                  return true
                                })

                              return res.status(500).send({ error: err.toString() })
                            })
                        } else {
                          let updateObjError = {
                            recentWithdrawalAmount: FieldValue.increment(
                              -parseFloat(req.body.amount)
                            ),
                          }
                          updateObjError[
                            'balances.' + req.body.currency.toLowerCase()
                          ] = FieldValue.increment(parseFloat(req.body.amount))
                          db.collection('users')
                            .doc(user.uid)
                            .update(updateObjError)
                            .then((done) => {
                              return true
                            })
                            .catch((err) => {
                              console.log('ERR restoring user balance', err)
                              return true
                            })
                          // now we will create a withdrawalreceipt with a failed status.
                          let withdrawalData = {
                            user: user.uid,
                            created: new Date(),
                            customerTransactionId: customerTransactionId,
                            quote: quoteResponse.data.id,
                            targetAccount: transferwiseId,
                            amount: req.body.amount,
                            currency: req.body.currency,
                            error: 'Transfer could not be created',
                          }

                          db.collection('withdrawals')
                            .add(withdrawalData)
                            .then((done) => {
                              return true
                            })
                            .catch((err) => {
                              console.log('ERROR creating receipt', err)
                              return true
                            })

                          return res.status(422).send({ error: 'Unable to create transfer' })
                        }
                      })
                      .catch((err) => {
                        let updateObjError = {
                          recentWithdrawalAmount: FieldValue.increment(
                            -parseFloat(req.body.amount)
                          ),
                        }
                        updateObjError[
                          'balances.' + req.body.currency.toLowerCase()
                        ] = FieldValue.increment(parseFloat(req.body.amount))
                        db.collection('users')
                          .doc(user.uid)
                          .update(updateObjError)
                          .then((done) => {
                            return true
                          })
                          .catch((err) => {
                            console.log('ERR restoring user balance', err)
                            return true
                          })
                        // now we will create a withdrawalreceipt with a failed status.
                        let withdrawalData = {
                          user: user.uid,
                          created: new Date(),
                          customerTransactionId: customerTransactionId,
                          quote: quoteResponse.data.id,
                          targetAccount: transferwiseId,
                          amount: req.body.amount,
                          currency: req.body.currency,
                          error: err.toString() + '#1',
                        }

                        db.collection('withdrawals')
                          .add(withdrawalData)
                          .then((done) => {
                            return true
                          })
                          .catch((err) => {
                            console.log('ERROR creating receipt', err)
                            return true
                          })

                        return res.status(500).send({ error: err.toString() })
                      })
                  } else {
                    console.log(
                      '2 After deducting amount user had less than 0 balance, so we revert and cancel.',
                      userdoc.data().balances
                    )

                    let updateObjError = {
                      recentWithdrawalAmount: FieldValue.increment(-parseFloat(req.body.amount)),
                    }
                    updateObjError.balances[req.body.currency.toLowerCase()] = FieldValue.increment(
                      parseFloat(req.body.amount)
                    )
                    db.collection('users')
                      .doc(user.uid)
                      .update(updateObjError)
                      .then((done) => {
                        console.log('RESET USER BALANCE')
                        return true
                      })
                      .catch((err) => {
                        console.log('ERR restoring user balance', err)
                        return true
                      })
                    // now we will create a withdrawalreceipt with a failed status.
                    let withdrawalData = {
                      user: user.uid,
                      created: new Date(),
                      quote: quoteResponse.data.id,
                      targetAccount: transferwiseId,
                      amount: req.body.amount,
                      currency: req.body.currency,
                      error: 'Insufficient funds',
                    }

                    console.log('WITHDRAWAL RECEIPT', withdrawalData)

                    db.collection('withdrawals')
                      .add(withdrawalData)
                      .then((done) => {
                        console.log('CREATED WITHDRAWAL RECEIPT')
                        return true
                      })
                      .catch((err) => {
                        console.log('ERROR creating receipt', err)
                        return true
                      })

                    return res.status(422).send({ error: 'Invalid withdrawal amount' })
                  }
                })
                .catch((err) => {
                  return res.status(500).send({ error: err.toString() })
                })
            })
            .catch((err) => {
              return res.status(500).send({ error: err.toString() })
            })
        } else {
          return res.status(422).send({ error: 'Invalid withdrawal amount' })
        }
      })
      .catch((err) => {
        return res.status(500).send({ error: err.toString() })
      })
  } else {
    console.log(
      'Err amount1 ',
      req.body.amount,
      req.body.currency,
      user.balances[req.body.currency.toLowerCase()]
    )
    return res.status(422).send({ error: 'Invalid withdrawal amount' })
  }
}
