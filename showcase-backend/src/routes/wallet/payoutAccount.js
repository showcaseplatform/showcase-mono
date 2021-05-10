const { transferWise } = require('../../config')
const axios = require('axios')
const { firestore: db } = require('../../services/firestore')

module.exports = (req, res) => {
  const { user } = req

  if (req.body.currency === 'USD') {
    axios({
      method: 'post',
      url: 'https://api.sandbox.transferwise.tech/v1/accounts',
      data: {
        profile: transferWise.profile,
        currency: 'USD',
        type: 'aba',
        accountHolderName: req.body.name,
        ownedByCustomer: true,
        details: {
          legalType: 'PRIVATE',
          abartn: req.body.routingnumber,
          accountNumber: req.body.accountnumber,
          accountType: req.body.accounttype,
          city: req.body.city,
          address: {
            country: 'US', //req.body.country,
            firstLine: req.body.firstline,
            postCode: req.body.postalcode,
          },
        },
      },
      headers: {
        Authorization: `Bearer ${transferWise.token}`,
      },
    })
      .then((response) => {
        if (response.data && response.data.id) {
          return db
            .collection('users')
            .doc(user.uid)
            .update({
              transferwiseIdUSD: response.data.id,
              transferwiseAccountNumberUSD: req.body.accountnumber,
            })
            .then((done) => {
              console.log('Updated profile')
              return res.send('OK')
            })
            .catch((err) => {
              console.log('ERR FB DB')
              return res.status(422).send({ error: err.toString() })
            })
        } else {
          console.log('ERR TW Input')
          return res.status(422).send({ error: 'Invalid input' })
        }
      })
      .catch((err) => {
        console.log('TW ERR', err)
        return res.status(422).send({ error: err.toString() })
      })
  } else if (req.body.currency === 'GBP') {
    axios({
      method: 'post',
      url: 'https://api.sandbox.transferwise.tech/v1/accounts',
      data: {
        profile: transferWise.profile,
        currency: 'GBP',
        type: 'sort_code',
        accountHolderName: req.body.name,
        ownedByCustomer: true,
        details: {
          legalType: 'PRIVATE',
          sortCode: req.body.sortcode,
          accountNumber: req.body.accountnumber,
        },
      },
      headers: {
        Authorization: `Bearer ${transferWise.token}`,
      },
    })
      .then((response) => {
        if (response.data && response.data.id) {
          return db
            .collection('users')
            .doc(user.uid)
            .update({
              transferwiseIdGBP: response.data.id,
              transferwiseAccountNumberGBP: req.body.accountnumber,
            })
            .then((done) => {
              console.log('Updated profile')
              return res.send('OK')
            })
            .catch((err) => {
              console.log('ERR FB DB')
              return res.status(422).send({ error: err.toString() })
            })
        } else {
          console.log('ERR TW Input')
          return res.status(422).send({ error: 'Invalid input' })
        }
      })
      .catch((err) => {
        console.log('TW ERR', err)
        return res.status(422).send({ error: err.toString() })
      })
  } else if (req.body.currency === 'EUR') {
    axios({
      method: 'post',
      url: 'https://api.sandbox.transferwise.tech/v1/accounts',
      data: {
        profile: transferWise.profile,
        currency: 'EUR',
        type: 'iban',
        accountHolderName: req.body.name,
        ownedByCustomer: true,
        details: {
          legalType: 'PRIVATE',
          //BIC:req.body.bic,
          IBAN: req.body.iban,
        },
      },
      headers: {
        Authorization: `Bearer ${transferWise.token}`,
      },
    })
      .then((response) => {
        if (response.data && response.data.id) {
          return db
            .collection('users')
            .doc(user.uid)
            .update({
              transferwiseIdEUR: response.data.id,
              transferwiseAccountNumberEUR: req.body.iban,
            })
            .then((done) => {
              console.log('Updated profile')
              return res.send('OK')
            })
            .catch((err) => {
              console.log('ERR FB DB')
              return res.status(422).send({ error: err.toString() })
            })
        } else {
          console.log('ERR TW Input')
          return res.status(422).send({ error: 'Invalid input' })
        }
      })
      .catch((err) => {
        console.log('TW ERR', err)
        return res.status(422).send({ error: err.toString() })
      })
  } else {
    console.log('INVALID CURRENCY')
    return res.status(422).send({ error: 'Invalid currency' })
  }
}
