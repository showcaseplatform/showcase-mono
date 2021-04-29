import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

if (admin.apps.length === 0) {
  // Initialize with default credentials if not already
  admin.initializeApp()
}

const auth = admin.auth()
const firestore = admin.firestore()
const FieldValue = admin.firestore.FieldValue

export { firestore, FieldValue, functions, auth }
