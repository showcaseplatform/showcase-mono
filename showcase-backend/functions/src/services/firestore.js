const admin = require('firebase-admin')

if (admin.apps.length === 0) {
  // Initialize with default credentials if not already
  admin.initializeApp()
}

const firestore = admin.firestore()
const FieldValue = admin.firestore.FieldValue

module.exports = { firestore, FieldValue }
