import { firestore as db } from '../../services/firestore'
import { Follower, ListFollowersResponse, PublicProfile, User } from '../../types/user'

export interface ListFollowersInput {
  user: User
  lastdate: any
}

const getFollowerProfiles = async (followers: Follower[]) => {
  const allProfiles: PublicProfile[] = []

  for (var i = 0; i < followers.length; i++) {
    const otherUser = await db.collection('users').doc(followers[i].uid).get()
    const profileData = otherUser.data() as User
    allProfiles.push({
      uid: profileData.uid,
      bio: profileData.bio,
      creator: profileData.creator,
      displayName: profileData.displayName,
      username: profileData.username,
      avatar: profileData.avatar,
    })
  }

  return allProfiles
}

const listFollowCollection = async ({
  user,
  lastdate,
}: ListFollowersInput, collection: 'followers' | 'followings'): Promise<ListFollowersResponse> => {
  const myQuery = db.collection('users').doc(user.uid).collection(collection)

  // todo: revise pagination
  if (lastdate) {
    lastdate = new Date(lastdate)
    myQuery.where('createdDate', '<', lastdate).orderBy('createdDate', 'desc')
  }

  const snapshot = await myQuery.limit(30).get()

  if (snapshot.empty) return { profiles: [], lastdate: null }

  let newlastdate = null
  const followers = snapshot.docs.map((x) => x.data() as Follower)
  if (followers && followers.length > 0) {
    newlastdate = followers[followers.length - 1].createdDate
  }

  const allProfiles = await getFollowerProfiles(followers)

  return { profiles: allProfiles, lastdate: newlastdate }
}

export const listFollowers = async({
  user,
  lastdate,
}: ListFollowersInput) => {
  return await listFollowCollection({user, lastdate}, 'followers')
}

export const listFollowings = async({
  user,
  lastdate,
}: ListFollowersInput) => {
  return await listFollowCollection({user, lastdate}, 'followings')
}