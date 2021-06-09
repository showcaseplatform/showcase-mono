const { client: algoliaClient } = require('../services/algolia')
const { functions } = require('../services/firebase')

const onUserIndexDeletionHandler = (client, snap, context) => {
  const index = client.initIndex('users')
  const objectID = context.params.uid
  return index.deleteObject(objectID)
}

export const userDeletionTrigger = functions.firestore
  .document(`users/{uid}`)
  .onDelete((snap, context) => {
    return onUserIndexDeletionHandler(algoliaClient, snap, context)
  })
