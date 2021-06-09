const { functions } = require('../services/firebase')
const { client: algoliaClient } = require('../services/algolia')

// Update the search index every time a blog post is written.
const onUserWriteHandler = (client, data, context) => {
  // Get the note document
  const fullUser = data.after.data()

  const user = {
    uid: fullUser.uid,
    creator: fullUser.creator || false,
    displayName: fullUser.displayName,
    username: fullUser.username,
    bio: fullUser.bio,
    objectID: fullUser.uid,
    avatar: fullUser.avatar,
  }

  console.log('USER UPDATE WRITE', user)

  // Write to the algolia index
  const index = client.initIndex('users')
  return index.saveObject(user)
}

export const onUserWriteTrigger = functions.firestore
  .document('users/{uid}')
  .onWrite((data, context) => {
    return onUserWriteHandler(algoliaClient, data, context)
  })
