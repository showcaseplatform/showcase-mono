const db = require('firebase-admin').firestore()

module.exports = async (req, res) => {
  let getUser = await db.collection('users').doc(req.params.id).get()
  let user = getUser.data()
  if (user.avatar) {
    return res.redirect(301, user.avatar)
  } else {
    return res.send(500)
  }
}
