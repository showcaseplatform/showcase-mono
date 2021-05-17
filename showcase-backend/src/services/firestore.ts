import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

const auth = admin.auth
const firestore = admin.firestore()
const FieldValue = admin.firestore.FieldValue
const FieldPath = admin.firestore.FieldPath
const Timestamp = admin.firestore.Timestamp

export { firestore, FieldValue, functions, auth, FieldPath, Timestamp }
