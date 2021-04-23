exports.onBadgeSaleWriteHandler = (client, data, context) => {
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
