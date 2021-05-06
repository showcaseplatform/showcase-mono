import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

const auth = admin.auth
const firestore = admin.firestore()
const FieldValue = admin.firestore.FieldValue

export { firestore, FieldValue, functions, auth }
