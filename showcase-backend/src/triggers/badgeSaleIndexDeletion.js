const { client: algoliaClient } = require('../services/algolia')
const { functions } = require('../services/firebase')

const badgeSaleDeletionHandler = (client, snap, context) => {
  const index = client.initIndex('badgesales')
  const objectID = context.params.badgeId
  return index.deleteObject(objectID)
}

export const badgeSaleDeletionTrigger = functions.firestore
  .document(`badgesales/{badgeId}`)
  .onDelete((snap, context) => {
    return badgeSaleDeletionHandler(algoliaClient, snap, context)
  })
