import { firestore as db } from '../../services/firestore'
import { Follower, ListFollowersResponse, Profile, User } from '../../types/user'

export interface ListFollowersInput {
  user: User
  lastdate: any
}

const getFollowerProfiles = async (followers: Follower[]) => {
  const allProfiles: Profile[] = []

  for (var i = 0; i < followers.length; i++) {
    const otherUser = await db.collection('users').doc(followers[i].uid).get()
    const profileData = otherUser.data()
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

export const listFollowers = async ({
  user,
  lastdate,
}: ListFollowersInput): Promise<ListFollowersResponse> => {
  const myQuery = db.collection('users').doc(user.uid).collection('followers')

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

  return { profiles: allProfiles, lastdate: newlastdate?.toDate() || null }
}
