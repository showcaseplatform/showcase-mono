import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

// todo: add this to env variables
const serviceAccount = {
  type: 'service_account',
  project_id: 'showcase-dev-7507d',
  private_key_id: 'f687e1229605fdafa8b6c159430bc57444681bd0',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJjkbH/0vptn0T\nPY4om3xDTxNWHFcc+R4V0eSRGFRRELDgwzLTHFvfsH30yXRwgdF4pf4S+RXMbslN\nr2RVFjoYD1hIla/J+fuz0/Ctlmk524m0EaEWLynn/E1Kz+kAh76pnZArP5q0bQ2v\n/6TQedI5w8A/hjIZJrbWWCTGyblLweypCnWGMJKoBpygblqpkdB6YoAPEFwzLYYP\ntVyghyq+K5AF18s61XulwhltvhGDXdjvPOEC8vc4N3AOdW7pAEMebG9tdDqOx4QD\n56eDc0pprU0vDGlQEWi0G1Wym0oXOSpCPb5ks0HZxPAOaAxPK+TzZ1P9D8DJWGwa\nK1ws5xv7AgMBAAECggEAXsnXhdUNeXNGLRdE1NoSvYDhwhx/53NM78wPJyF+/cTQ\nulNygpASsQdKpSVc6lBTF99QttGHq+XqK+uxTsauOYR162TiECXNdsvUo35aLEiP\n4SxtSoaRubUREH7owEQWqaQdGgnGktW6myup8hVohZwGvJk61FM9p146pXZW+0X5\nG+lVbcOj2KJY5CMSZ5ryUkk8YTYb4j7t/VTWiy99Usw+ldbM15wLTHWTJNL5Weu/\nVxeQUPnMOszIkYC6loyaudt6FhNvbcrjnQNhejk8tHXq5VovFc5ywnlG7DLLOKh9\nGPKlV9Ii1y01szRR0+JqYbcR3OKzGxUHAzukqK4SSQKBgQDxlxEZNxkuTDdbaFDg\nOeJZHgam84SKmrZXZDAOhEaOJBnPGZCls+yyTYR2wUROPeEtDjBkneGllduf35Os\n0xbLn+f4TCInTJ/R0n7Bhzocy99VhywXdPVgxJ8sR9h9JavqR+BWLjx+fTxFW2Q8\nH+QPVeBw4ZYwRRD7rdsJy4ha/QKBgQDVk+jrjcjg3znVVAYRQF8SpfZPSDH/IFIJ\nKoeS3hCdg1sgN6CBZYMBVviS+vdytlCyd5Rk3h5kD3EKVMvhGzWp+XHm3/THG10A\nMhllt/Vgb2kFdUiZJ6dEvHo3ApKQYW2SoKuUuqq8mycOL3bCkcV8W5LErKa1NMwv\nbSFvaD/wVwKBgQDDE3+sA7CikMp2VdJQbI0X9sXaU3Jn1St9f5nKbwblycLJVtRU\n6Ocsxqk6ly6HmzHTBs0Owemtokc4XflJqR2UCKfv99HwN9ApRjYyIPZMwFazIjX5\nLujgXYRF5jGqRBwATk+YZzdTz942Buj2H64wr+BOZem3Sl2/TBA9ZYrSJQKBgHA2\nmz0PrIhBoIAt+lYcDReeLPBwzRvvXkrElqCanf40Iq+lqmXx8MfGaynGRDZ4BaQO\n4d+xOCR4XHsCHHB0PFjG34pfBpuKC+3rZJ6l7X0ya+pbOb6GMAMUR94ZMuo61jgg\nxKWLAePAXN++HlaSAkGZV16QG7K/P7x3SQbgrh9XAoGBALCVHs01uCg/yMa6u3Wh\nDRokdYwQujN5AjaEnn4rG8epahfD6/EqtLXsD86GpgdhP8piyCw1M8Zixe6sHozn\nh/YFou+ORrkdOk1tuS5ZkRv1S00lpHeW05j2GyXPdBJy1Xemr3syksHh6cxSrAQE\ni2zmTGqVhBwRU3joxbnnJOgP\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-c08fn@showcase-dev-7507d.iam.gserviceaccount.com',
  client_id: '106658174989186475097',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-c08fn%40showcase-dev-7507d.iam.gserviceaccount.com',
} as any

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const auth = admin.auth
const firestore = admin.firestore()
const FieldValue = admin.firestore.FieldValue
const FieldPath = admin.firestore.FieldPath
const Timestamp = admin.firestore.Timestamp

export { firestore, FieldValue, functions, auth, FieldPath, Timestamp }
