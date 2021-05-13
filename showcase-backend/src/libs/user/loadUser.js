import { firestore as db } from '../../services/firestore'


export const loadUser = (req, res) => {
  return res.send({ user: req.user })
}


export const loadOtherUser = async (req, res) => {
  const { user } = req
  const requestedUserId = req.query.userid
  if (requestedUserId) {
    let fields = ['uid', 'bio', 'creator', 'displayName', 'username', 'avatar']
    try {
      let otherUser = await db.collection('users').doc(requestedUserId).get()
      let otherUserFollowing = await db
        .collection('users')
        .doc(user.uid)
        .collection('following')
        .doc(requestedUserId)
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
