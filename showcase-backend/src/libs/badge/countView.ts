import { firestore as db, FieldValue } from '../../services/firestore'
import { BadgeDocumentData, BadgeId, CountViewRequestBody } from '../../types/badge'
import { blockchain } from '../../config'
import axios from 'axios'
import { User } from '../../types/user'
import Boom from 'boom'

const increaseBadgeViewCount = async (badgeid: BadgeId) => {
  try {
    await db
      .collection('badges')
      .doc(badgeid)
      .update({ views: FieldValue.increment(1), lastViewed: new Date() })
  } catch (error) {
    console.error('increaseBadgeViewCount failed: ', error)
    throw error
  }
}

const removeBadgeFromShowCase = async ({
  badge,
  badgeid,
}: {
  badge: BadgeDocumentData
  badgeid: BadgeId
}) => {
  try {
    await db.collection('users').doc(badge.creatorId).update({ banned: true })
    await db.collection('badges').doc(badgeid).update({ removedFromShowcase: true })
    console.log('Badge removed from showcase: ', { badgeid }, { badge })
  } catch (error) {
    console.error('removeBadgeFromShowCase failed: ', error)
    throw error
  }
}

const checkBadgeOnBlockchain = async (
  badgeowner: any,
  badgeid: BadgeId,
  badge: BadgeDocumentData
) => {
  const data = {
    badgeid,
    badgeowner,
    token: blockchain.authToken,
  }
  console.log('BAGDE VERIFICATION DATA', data)
  try {
    const response = await axios.post(blockchain.server + '/verifyOwnershipOfBadge', data)
    console.log(response.data)
    if (!response?.data?.isOwner) {
      await removeBadgeFromShowCase({ badge, badgeid })
    }
  } catch (error) {
    // we don't want to have a network error make peole get banned.
    console.error('checkBadgeOnBlockchain failed: ', error)
    throw error
  }
}

const countPrivateBadgeView = async (badgeid: BadgeId) => {
  //random badge inspection....
  let min = Math.ceil(1)
  let max = Math.floor(51)
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min
  //check badge
  try {
    if (randomNum === 51) {
      const badgeDoc = await db.collection('badges').doc(badgeid).get()
      const badge = badgeDoc.data() as BadgeDocumentData
      const userdoc = await db.collection('users').doc(badge.creatorId).get()
      if (!userdoc.exists) {
        throw Boom.notFound('Creator not found', { badge, userdoc })
      } else {
        console.log('CHECKING BADGE from creator', { badge }, { userdoc })
        const user = userdoc.data() as User
        await checkBadgeOnBlockchain(user.crypto?.address, badge.tokenId, badge)
      }
    }
    await increaseBadgeViewCount(badgeid)
  } catch (error) {
    console.error('countPrivateBadgeView failed: ', error)
    throw error
  }
}

export const countViewHandler = async ({
  marketplace,
  badgeid,
}: CountViewRequestBody): Promise<void> => {
  try {
    if (!marketplace) {
      await countPrivateBadgeView(badgeid)
    } else {
      await db
        .collection('badgesales')
        .doc(badgeid)
        .update({ views: FieldValue.increment(1) })
    }
  } catch (error) {
    console.error('countViewHandler failed: ', error)
    throw error
  }
}

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
