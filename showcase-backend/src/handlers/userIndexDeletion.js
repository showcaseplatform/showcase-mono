exports.onUserIndexDeletionHandler = (client, snap, context) => {
    const index = client.initIndex('users');
  	const objectID = context.params.uid;
	return index.deleteObject(objectID);
}