/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin')
var validator = require('validator')
const db = admin.firestore()
let FieldValue = admin.firestore.FieldValue
const { twilio: twilioConfig } = require('../../config')
const twilio = require('twilio')(twilioConfig.account, twilioConfig.token)

//later we can add a time length for the "ban" if too many attempts
module.exports = (req, res) => {
  const sendError = (error) => {
    console.log('ERROR LOG', error)
    res.status(422).send(error)
  }
  const { phone, areaCode } = req.body
  console.log('Called server PHONE AUTH', phone, areaCode, req.body, '+' + areaCode + '' + phone)
  console.log('COMBINED PHONE NUMBER', '+' + areaCode + '' + phone)
  if (!phone || !areaCode || !validator.isMobilePhone(phone))
    return res.status(422).send({ error: 'Invalid mobile phone number format' })
  console.log(1)
  return admin
    .auth()
    .getUserByPhoneNumber('+' + areaCode + '' + phone)
    .then((user) => {
      let existingAttemptRef = db.collection('unverifiedsmsverifications').doc(areaCode + phone)
      return existingAttemptRef.get().then((doc) => {
        if (!doc.exists) {
          const code = Math.floor(Math.random() * 899999 + 100000)
          const expiration = Date.now() + 1 * 90000 // Expires in 1 minutes
          const verification = {
            code,
            expiration,
            valid: true,
            codesSent: 0,
            codesSentSinceValid: 0,
            attemptsEnteredSinceValid: 0,
            attemptsEntered: 0,
          }
          return twilio.messages
            .create({
              body: `Your Showcase login code is ${code}`,
              to: '+' + areaCode + phone,
              from: twilioConfig.from,
            })
            .then((message) => {
              let verificationRef = db
                .collection('unverifiedsmsverifications')
                .doc(areaCode + phone)
              return verificationRef
                .set(verification)
                .then(() => {
                  return res.send({ success: true })
                })
                .catch(sendError)
            })
            .catch(sendError)
        } else {
          console.log('existing attempt (a):', doc.data())
          const existingAttempt = doc.data()
          if (existingAttempt.codesSent > 20 || existingAttempt.attemptsEnteredSinceValid > 8) {
            console.log('TOO MANY ATTEMPTS NOT SENDING CODE')
            return res.status(422).send({ error: 'Too many attempts with this number' })
          } else {
            console.log('SENDING CODE')
            let code = existingAttempt.code
            if (!existingAttempt.valid) {
              // make a new
              code = Math.floor(Math.random() * 899999 + 100000)
            }

            return twilio.messages
              .create({
                body: `Your Showcase login code is ${code}`,
                to: '+' + areaCode + phone,
                from: twilioConfig.from,
              })
              .then((message) => {
                let verificationRef = db
                  .collection('unverifiedsmsverifications')
                  .doc(areaCode + phone)
                let updatedSettings = {
                  valid: true,
                  codesSent: FieldValue.increment(1),
                  codesSentSinceValid: FieldValue.increment(1),
                  attemptsEnteredSinceValid: FieldValue.increment(1),
                  attemptsEntered: FieldValue.increment(1),
                  expiration: Date.now() + 1 * 90000,
                }
                console.log('SET NEW CODE', code, existingAttempt.code, existingAttempt.valid)
                if (code) {
                  updatedSettings.code = code
                }
                return doc.ref
                  .update(updatedSettings)
                  .then(() => {
                    return res.send({ success: true })
                  })
                  .catch(sendError)
              })
              .catch(sendError)
          }
        }
      })
    })
    .catch((getUserErr) => {
      console.log(21, getUserErr, '+' + areaCode + '' + phone)
      if (getUserErr.code === 'auth/user-not-found') {
        console.log(23)
        //later we can save app install ids and ips and we can check if someone is abusing this to send many texts
        let existingAttemptRef = db.collection('unverifiedsmsverifications').doc(areaCode + phone)
        let getExistingAttempt = existingAttemptRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log('New verification')
              const code = Math.floor(Math.random() * 899999 + 100000)
              const expiration = Date.now() + 1 * 90000 // Expires in 1 minutes
              const verification = {
                code,
                expiration,
                valid: true,
                codesSent: 0,
                codesSentSinceValid: 0,
                attemptsEnteredSinceValid: 0,
                attemptsEntered: 0,
                phoneNumber: '+' + areaCode + '' + phone,
              }
              return twilio.messages
                .create({
                  body: `Your Showcase signup code is ${code}`,
                  to: '+' + areaCode + phone,
                  from: twilioConfig.from, 
                })
                .then((message) => {
                  let verificationRef = db
                    .collection('unverifiedsmsverifications')
                    .doc(areaCode + phone)
                  return verificationRef
                    .set(verification)
                    .then(() => {
                      return res.send({ success: true })
                    })
                    .catch(sendError)
                })
                .catch(sendError)
            } else {
              console.log('existing attempt:', doc.data())
              const existingAttempt = doc.data()
              if (existingAttempt.codesSent > 20 || existingAttempt.attemptsEnteredSinceValid > 8) {
                console.log('NOT SENDING CODE TOO MANY ATTEMPT')
                return res.status(422).send({ error: 'Too many attempts with this number' })
              } else {
                console.log('SENDING EIXSTING CODE', existingAttempt.code)
                return twilio.messages
                  .create({
                    body: `Your Showcase signup code is ${existingAttempt.code}`,
                    to: '+' + areaCode + phone,
                    from: twilioConfig.from,
                  })
                  .then((message) => {
                    console.log('TWILLIO MESG', message)
                    let verificationRef = db
                      .collection('unverifiedsmsverifications')
                      .doc(areaCode + phone)
                    let updatedSettings = {
                      valid: true,
                      codesSent: FieldValue.increment(1),
                      codesSentSinceValid: FieldValue.increment(1),
                      attemptsEnteredSinceValid: FieldValue.increment(1),
                      attemptsEntered: FieldValue.increment(1),
                      expiration: Date.now() + 1 * 90000,
                    }
                    return doc.ref
                      .update(updatedSettings)
                      .then(() => {
                        return res.send({ success: true })
                      })
                      .catch(sendError)
                  })
                  .catch(sendError)
              }
            }
          })
          .catch(sendError)
      } else {
        console.log(22)
        return res.status(422).send({ error: getUserErr })
      }
    })
}
