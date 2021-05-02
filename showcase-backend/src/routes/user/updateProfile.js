const { firestore: db } = require('../../services/firestore')
const validator = require('validator')

const currencies = ['USD', 'EUR', 'GBP']

module.exports = (req, res) => {
  let user = req.user.data()

  let updateData = {}

  if (req.body.bio) {
    if (req.body.bio.length <= 240) {
      updateData.bio = req.body.bio
      addEmail()
    } else {
      return res.status(422).send('invalid_bio')
    }
  } else {
    addEmail()
  }

  async function addEmail() {
    if (req.body.email) {
      let existingUser = await db.collection('users').where('email', '==', req.body.email).get()
      if (
        validator.isEmail(req.body.email) &&
        (!existingUser.exists || user.email === req.body.email)
      ) {
        updateData.email = req.body.email
        return addUsername()
      } else {
        return res.status(422).send('invalid_email')
      }
    } else {
      return addUsername()
    }
  }
  async function addUsername() {
    if (req.body.username) {
      let existingUser = await db
        .collection('users')
        .where('username', '==', req.body.username)
        .get()
      if (
        req.body.username.length <= 28 &&
        (!existingUser.exists || user.username === req.body.username) &&
        /^[a-zA-Z0-9_]+$/g.test(req.body.username)
      ) {
        updateData.username = req.body.username
        return addDisplayName()
      } else {
        console.log('EXISTING USER', existingUser)
        return res.status(422).send('invalid_username')
      }
    } else {
      return addDisplayName()
    }
  }
  function addDisplayName() {
    if (req.body.displayName) {
      if (req.body.displayName.length <= 36) {
        updateData.displayName = req.body.displayName
        return addBirthdate()
      } else {
        return res.status(422).send('invalid_displayname')
      }
    } else {
      return addBirthdate()
    }
  }
  function addBirthdate() {
    if (req.body.birthDate) {
      if (new Date(req.body.birthDate) < new Date(2005, 12, 31)) {
        updateData.birthDate = new Date(req.body.birthDate)
        updateData.birthDay = updateData.birthDate.getDate()
        updateData.birthMonth = updateData.birthDate.getMonth()
        updateData.birthYear = updateData.birthDate.getFullYear()
        return addCurrency()
      } else {
        return res.status(422).send('invalid_birthdate')
      }
    } else {
      return addCurrency()
    }
  }
  function addCurrency() {
    if (req.body.currency) {
      if (currencies.indexOf(req.body.currency) > -1) {
        updateData.currency = req.body.currency
        return addAvatar()
      } else {
        return res.status(422).send('invalid_currency')
      }
    } else {
      return addAvatar()
    }
  }
  function addAvatar() {
    if (req.body.avatar) {
      updateData.avatar =
        'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/images%2F' +
        user.uid +
        '?alt=media'
      return doUpdates()
    } else {
      return doUpdates()
    }
  }
  function doUpdates() {
    console.log('DO UPDATE ', updateData)
    if (Object.keys(updateData).length < 1) {
      return res.send('OK')
    } else {
      db.collection('users')
        .doc(user.uid)
        .update(updateData)
        .then((done) => {
          console.log('Updated profile')
          return res.send('OK')
        })
        .catch((err) => {
          return res.status(422).send({ error: err })
        })
    }
  }
}
