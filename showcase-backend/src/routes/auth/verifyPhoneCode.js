/* eslint-disable promise/no-nesting */
const { firestore: db, FieldValue, auth } = require('../../services/firestore')
const { v5: uuidv5 } = require('uuid')
const uuidNamespace = 'b01abb38-c109-4b71-9136-a2aa73ddde27' // todo: maybe outsource to config

module.exports = (req, res) => {
  const sendError = (error) => res.status(422).send(error)
  const { code, phone, areaCode } = req.body
  return auth()
    .getUserByPhoneNumber('+' + areaCode + '' + phone)
    .then((user) => {
      console.log('Has user', user)
      let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode + phone)
      return verificationRef
        .get()
        .then((doc) => {
          /*return db.collection('users')
              .doc(user.uid)
              .get()
              .then((doc) => {*/
          const timeNow = Date.now()
          const verification = doc.data()
          console.log('VERIFICATION', verification)
          let error = null

          if (verification.code.toString() !== code.toString()) {
            error = 'custom/code-does-not-match'
          } else if (!verification.valid) {
            error = 'custom/code-already-used'
          } else if (timeNow > verification.expiration) {
            error = 'custom/code-expired'
          }

          if (error) {
            console.log('ERR', error)
            doc.ref.update({
              codesSentSinceValid: FieldValue.increment(1),
              attemptsEnteredSinceValid: FieldValue.increment(1),
            })

            return Promise.reject(new Error(error))
          }

          doc.ref.update({
            valid: false,
            codesSentSinceValid: 0,
            attemptsEnteredSinceValid: 0,
          })

          return Promise.resolve(user.uid)
        })
        .then((uid) => {
          return auth().createCustomToken(uid)
        })
        .then((token) => {
          return res.send({ token })
        })
        .catch(sendError)
    })
    .catch((getUserErr) => {
      console.log('NEW USER0')
      if (getUserErr.code === 'auth/user-not-found') {
        console.log('NEW USER')
        let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode + phone)
        return verificationRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log('NO VERIFICATION CODE ERR')
              return res.status(422).send({ error: 'No verification code sent to that number!' })
            } else {
              console.log('FOUND VERIFICATION DOC', doc.data())
              let verification = doc.data()
              const timeNow = Date.now()

              if (
                verification.code.toString() !== code.toString() ||
                !verification.valid ||
                timeNow > verification.expiration
              ) {
                console.log(
                  'CHECKS',
                  verification.code.toString() !== code.toString(),
                  !verification.valid,
                  timeNow > verification.expiration
                )
                //(parseInt(verification.code) !== code) , ((verification.code+"") !== (code+""))
                //console.log("CHECKS", ( (verification.code).toString() !== (code).toString() ) )
                //console.log("DATA", verification, code, (code+""), timeNow, typeof code, typeof verification.code);
                doc.ref.update({
                  attemptsEnteredSinceValid: FieldValue.increment(1),
                  attemptsEntered: FieldValue.increment(1),
                })
                console.log('VERIFICATION INVALID')
                return res.status(422).send({ error: 'Code not valid' })
              }

              doc.ref.update({
                valid: false,
                codesSentSinceValid: 0,
                attemptsEnteredSinceValid: 0,
              })

              // create user here
              console.log('CREADTING NEW USER!!')
              let newId = uuidv5(phone, uuidNamespace)

              return auth()
                .createUser({
                  phoneNumber: '+' + areaCode + '' + phone,
                  phoneLocal: phone,
                  areaCode: areaCode,
                  uid: newId,
                })
                .then((user) => {
                  let userCurrency = 'USD' //default USD

                  const europeanCountryCodes = [
                    '39',
                    '43',
                    '32',
                    '387',
                    '385',
                    '420',
                    '45',
                    '372',
                    '358',
                    '33',
                    '49',
                    '350',
                    '30',
                    '36',
                    '353',
                    '371',
                    '382',
                    '31',
                    '47',
                    '48',
                    '351',
                    '7',
                    '421',
                    '386',
                    '34',
                    '46',
                    '41',
                  ]

                  if (areaCode + '' === '44') {
                    userCurrency = 'GBP'
                  } else if (europeanCountryCodes.indexOf(areaCode + '') > -1) {
                    userCurrency = 'EUR'
                  }

                  return db
                    .collection('users')
                    .doc(user.uid)
                    .set({
                      phoneNumber: '+' + areaCode + '' + phone,
                      phoneLocal: phone,
                      areaCode: areaCode,
                      liked: {},
                      followingCount: 0,
                      followersCount: 0,
                      uid: newId,
                      currency: userCurrency,
                      badgesCount: 0,
                      chats: {},
                      balances: {
                        usd: 0,
                        eur: 0,
                        gbp: 0,
                      },
                    })
                    .then((userdoc) => {
                      return auth().createCustomToken(user.uid)
                    })
                    .then((token) => {
                      return res.send({ token, newUser: true })
                    })
                    .catch(sendError)
                })
                .catch(sendError)
            }
          })
          .catch(sendError)
      } else {
        res.status(422).send({ error: getUserErr })
      }
    })
}
