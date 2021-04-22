const db = require('firebase-admin').firestore()

module.exports = async (req, res) => {
  let user = req.user.data()
  if (req.body.userid) {
    let fields = ['uid', 'bio', 'creator', 'displayName', 'username', 'avatar']
    try {
      let otherUser = await db.collection('users').doc(req.body.userid).get()
      let otherUserFollowing = await db
        .collection('users')
        .doc(user.uid)
        .collection('following')
        .doc(req.body.userid)
        .get()
      console.log('FOLLOWING?', otherUserFollowing)
      return res.json({
        user: {
          uid: otherUser.get(fields[0]),
          bio: otherUser.get(fields[1]),
          creator: otherUser.get(fields[2]),
          displayName: otherUser.get(fields[3]),
          username: otherUser.get(fields[4]),
          avatar: otherUser.get(fields[5]),
          otherUserFollowing: otherUserFollowing.exists,
        },
      })
    } catch (err) {
      console.log('ERROR GETTING OTHER USER', err)
      return res.status(422).send({ error: err })
    }
  } else {
    return res.status(422).send({ error: 'Invalid user' })
  }
}
