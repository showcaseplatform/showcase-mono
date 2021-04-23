const { firestore: db } = require('../../services/firestore')

module.exports = async (req, res) => {
  let user = req.user.data()
  let { lastdate } = req.body
  let myQuery = db.collection('users').doc(user.uid).collection('followers')
  if (lastdate) {
    lastdate = new Date(lastdate)
    myQuery = myQuery.where('createdDate', '<', lastdate).orderBy('createdDate', 'desc')
  }

  // todo: add pagination instead of simple limit
  myQuery
    .limit(30)
    .get()
    .then(async (snapshot) => {
      let newlastdate = null
      let docs = snapshot.docs.map((x) => x.data())
      if (docs && docs.length > 0) {
        newlastdate = docs[docs.length - 1].createdDate
      }

      let allProfiles = []
      // here we need to attach profile metadata.
      // todo: refactor await in loop to promise.all
      /* eslint-disable no-await-in-loop */
      for (var i = 0; i < docs.length; i++) {
        try {
          let otherUser = await db.collection('users').doc(docs[i].uid).get()
          let profileData = otherUser.data()
          console.log('GOT followers', profileData)
          allProfiles.push({
            uid: profileData.uid,
            bio: profileData.bio,
            creator: profileData.creator,
            displayName: profileData.displayName,
            username: profileData.username,
            avatar: profileData.avatar,
          })
        } catch (e) {
          console.log('ERROR FETCHING PROFIEL FOR FOLLOWER', e)
        }
      }
      /* eslint-enable no-await-in-loop */

      return res.json({ profiles: allProfiles, lastdate: newlastdate.toDate() })
    })
    .catch((err) => {
      console.log('Err listing followers')
      return res.status(422).send({ error: err })
    })
}
