import { PubSub} from 'apollo-server-express'

// TOPICS:
export const NEW_CHAT_MESSAGE = 'NEW_CHAT_MESSAGE'
export const NEW_NOTIFCATION = 'NEW_NOTIFCATION'


export const myPubSub = new PubSub();


