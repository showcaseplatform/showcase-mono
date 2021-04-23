exports.badgeSaleIndexDeletionHandler = (client, snap, context) => {
  const index = client.initIndex('badgesales')
  const objectID = context.params.badgeId
  return index.deleteObject(objectID)
}
