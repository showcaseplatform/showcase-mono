/* eslint-disable promise/no-nesting */
import { incrementPeriodBadgeViewCount } from '../../notifications/mostViewedBadge'
import { firestore as db, FieldValue } from '../../services/firestore'
import { blockchain } from '../../config'
import { post } from 'axios'

// todo: refactor function to eliminate promise nesting
export default (req, res) => {
  // marketplace: boolean
  const { marketplace, badgeid } = req.body

  let checkBadge = (badgeowner, badgeid, callback) => {
    const data = {
      badgeid,
      badgeowner,
      token: blockchain.authToken,
    }
    console.log('BAGDE VERIFICATION DATA', data)

    // todo: why is this commented out
    /*axios.post(blockchain.server+'/getMetadataOfBadge', {badgetype:"57896044618658097711785492504343953941267134110420635948653900123522597912576", token:  blockchain.authToken})
          .then(async (response) => {
              console.log("METADATA", response.data);
              return true;
          }).catch((e)=>{
              console.log("error verifying badge ownership", e)
              return true;
          })
  
          axios.post(blockchain.server+'/getOwnershipOfBadge', {badgeid, token:  blockchain.authToken})
          .then(async (response) => {
              console.log("current owner is:", response.data);
              return true;
          }).catch((e)=>{
              console.log("error verifying badge ownership", e)
              return true;
          })
  
  
          axios.post(blockchain.server+'/verifyBadgeInEscrow', {badgeid, token:  blockchain.authToken})
          .then(async (response) => {
              console.log("escrow is:", response.data);
              return true;
          }).catch((e)=>{
              console.log("error verifying badge escrow", e)
              return true;
          })
  */
    return post(blockchain.server + '/verifyOwnershipOfBadge', data)
      .then(async (response) => {
        console.log(response.data)
        if (response.data.isOwner) {
          return callback(true)
        } else {
          return callback()
        }
      })
      .catch((e) => {
        console.log('error verifying badge balance', e)
        return callback(true) // we don't want to have a network error make peole get banned.
      })
  }
  //random badge inspection....
  let min = Math.ceil(1)
  let max = Math.floor(51)
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min
  if (!marketplace) {
    //check badge
    db.collection('badges')
      .doc(badgeid)
      .get()
      .then((doc) => {
        console.log('LAST VIEWED', doc.data().lastViewed)
        if (randomNum === 51) {
          return db
            .collection('users')
            .doc(doc.data().creatorId)
            .get()
            .then((userdoc) => {
              console.log('CHECKING BADGE from creator', doc.data().creatorId, userdoc)
              console.log('CHECKING BADGE_' + doc.data().creatorId + '_')
              if (!userdoc.exists) {
                return res.status(422).send('creator not found')
              } else {
                return checkBadge(userdoc.data().crypto.address, doc.data().tokenId, (success) => {
                  console.log('CHECKING BADGE 1', success)
                  if (success) {
                    return db
                      .collection('badges')
                      .doc(badgeid)
                      .update({ views: FieldValue.increment(1), lastViewed: new Date() })
                      .then(async(snapshot) => {
                        console.log('CHECKING BADGE 2')
                        await incrementPeriodBadgeViewCount(badgeid)
                        return res.send('OK')
                      })
                      .catch((e) => {
                        console.log('Error getting documents', e)
                        return res.send('OK')
                      })
                  } else {
                    db.collection('users').doc(doc.data().creatorId).update({ banned: true })
                    db.collection('badges').doc(badgeid).update({ removedFromShowcase: true })
                    return res.status(422).send('removed')
                  }
                })
              }
            })
            .catch((err) => {
              console.log('Error getting documents', err)
              return res.status(422).send({ error: err })
            })
        } else {
          return db
            .collection('badges')
            .doc(badgeid)
            .update({ views: FieldValue.increment(1), lastViewed: new Date() })
            .then(async (snapshot) => {
              await incrementPeriodBadgeViewCount(badgeid)
              return res.send('OK')
            })
            .catch((e) => {
              console.log('Error getting documents', e)
              return res.status(422).send({ error: e })
            })
        }
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        return res.status(422).send({ error: err })
      })
  } else {
    db.collection('badgesales')
      .doc(badgeid)
      .update({ views: FieldValue.increment(1) })
      .then(async (snapshot) => {
        await incrementPeriodBadgeViewCount(badgeid)
        return res.send('OK')
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        return res.status(422).send({ error: err })
      })
  }
}
