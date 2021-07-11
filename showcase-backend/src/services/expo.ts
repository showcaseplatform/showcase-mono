import {
  Expo,
  ExpoPushErrorReceipt,
  ExpoPushMessage,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
} from 'expo-server-sdk'
import { expo as expoConfig } from '../config'

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
const expo = new Expo({ accessToken: expoConfig.token })

export { expo, Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushSuccessTicket, ExpoPushErrorReceipt }
