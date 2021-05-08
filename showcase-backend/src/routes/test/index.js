/* eslint-disable promise/no-nesting */
const { expo } = require('../../config')
const TestRouter = require('express').Router()
const { firestore: db } = require('../../services/firestore')
const axios = require('axios')

const API_KEY = 'AIzaSyCYBkt1m7Km3M7zQPzL_XlpSVPLG7uOVpo'

TestRouter.route('/getBearerToken').post(async (req, res) => {
  try {
    const { token } = req.body
    console.log({token})
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`;
    const data = {
        token,
        returnSecureToken: true
    };

    const options = {
        method: "post",
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
    };

    const response = await axios(options)
    console.log(response.data)

    res.status(200).send(response.data)
  } catch (error) {
    console.error({error})
    res.status(400).send(error)
  }
})


const sendNotification = (user, title, body, token, data, type, noPush) => {
  //'{    "data":"goes here" }'
  db.collection('users')
    .doc(user)
    .get()
    .then((userdoc) => {
      if (!noPush && userdoc && userdoc.data() && userdoc.data().notificationToken) {
        const message = {
          to: token,
          sound: 'default',
          title: title,
          body: body,
          data: { data: 'goes here' },
          _displayInForeground: true,
        }
        axios({
          url: expo.server,
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          data: message, // maybe we should use body instead of data here
        })
          .then((res) => {
            console.log('SENT NOTIFICATION', res)
            return true
          })
          .catch((err) => {
            console.log('ERR SENDING NOTIFICATION', err)
            return true
          })
      }

      //add notifications document
      let notificationDoc = {
        title,
        body,
        user,
        created: new Date(),
        data,
        read: false,
        type: type || 'normal',
      }

      db.collection('notifications')
        .add(notificationDoc)
        .then((res) => {
          console.log('Saved notification')
          return true
        })
        .catch((err) => {
          console.log('ERR saving notification', err)
          return true
        })

      return true
    })
    .catch((err) => {
      console.log('ERROR getting creator for notification send', err)
      return true
    })
}

TestRouter.route('/testnotifications').get((req, res) => {
  //title, body, badge, token, data
  sendNotification(
    'Title',
    'notification body',
    'ExponentPushToken[zW_fRQBL8tyga8cZKxAZVy]',
    '{    "data":"goes here" }'
  )
  res.send('OK')
})

TestRouter.route('/test1').get((req, res) => {
  db.collection('badgesales')
    .get()
    .then((querySnapshot) => {
      return querySnapshot.forEach((doc) => {
        let price = parseInt(Math.random() * 20)
        return doc.ref.update({ price })
      })
    })
    .catch((e) => {
      return console.log(e)
    })
})

TestRouter.route('/test2').get((req, res) => {
  db.collection('badgesales')
    .get()
    .then((querySnapshot) => {
      return querySnapshot.forEach((doc) => {
        let category = 'art'
        /*if (Math.random() < 0.5){
                  category="causes"
              }*/
        return doc.ref.update({ category: category })
      })
    })
    .catch((e) => {
      return console.log(e)
    })
})

TestRouter.route('/testq').get(async (req, res) => {
  let donationcause = 'http://www.conserveturtles.org/'
  console.log('LOKING UPp ', donationcause)
  if (donationcause && donationcause.length && donationcause.length > 0) {
    try {
      const foundCause = await db
        .collection('causes')
        .where('site', '==', donationcause)
        .limit(1)
        .get()
      if (!foundCause.empty) {
        console.log('FOUND', foundCause.docs[0].data())
      } else {
        console.log('ERR MISSING', foundCause.empty, foundCause)
      }
    } catch (e) {
      console.log('ERR FINDING CAUSE', e)
    }
  }
})


export { TestRouter }
