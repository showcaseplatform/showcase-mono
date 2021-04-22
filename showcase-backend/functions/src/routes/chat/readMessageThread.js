const db = require('firebase-admin').firestore()

module.exports = (req, res) => {
  let user = req.user.data()
  const { userId, chatId } = req.body
  console.log('BODY READ MSG', req.body)
  if (userId && chatId) {
    let updateData = {}

    updateData['chats.' + userId + '.unreadMessageCount'] = 0

    db.collection('users')
      .doc(user.uid)
      .update(updateData)
      .then((done) => {
        console.log('Updated profile')
        return true
      })
      .catch((err) => {
        console.error('Error writing document: ', err)
        return true
      })

    let chatUpdate = {}

    db.collection('chats')
      .doc(chatId)
      .collection('messages')
      .where('read', '==', false)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return true
        }

        return snapshot.docs.forEach((doc) => {
          console.log('UPDTING INDIVIDL MESSG', doc)
          db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .doc(doc.id)
            .update({ read: true })
            .then((done) => {
              console.log('Updated individual message')
              return true
            })
            .catch((err) => {
              console.error('Error writing invidiual message document: ', err)
              return true
            })
        })
      })
      .catch((err) => {
        console.error('Error getting invidiual message document: ', err)
        return true
      })

    return res.send('OK')
  } else {
    return res.status(422).send({ error: 'Error' })
  }
}
