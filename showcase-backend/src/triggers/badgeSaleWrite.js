const { client: algoliaClient } = require('../services/algolia')
const { functions } = require('../services/firebase')


const badgeSaleWriteHandler = (client, data, context) => {
  // Get the note document
  let fullBadge = data.after.data()

  fullBadge.objectID = context.params.badgeId
  const index = client.initIndex('badgesales')

  if (fullBadge.removedFromShowcase) {
    const objectID = context.params.badgeId
    return index.deleteObject(objectID)
  } else {
    return index.saveObject(fullBadge)
  }
}

export const badgeSaleWriteTrigger = functions.firestore
  .document('badgesales/{badgeId}')
  .onWrite((data, context) => {
    return badgeSaleWriteHandler(algoliaClient, data, context)
  })