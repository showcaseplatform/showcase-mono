/* eslint-disable promise/no-nesting */
import { firestore as db, FieldValue } from '../../services/firestore'
import { sendNewMessageReceivedNotifcation } from '../../libs/pushNotifications/newMessageReceived'

export const sendMessage = (req: any, res: any) => {
  const { user } = req
  const { message, userId, username, chatId } = req.body
  console.log('BODY SEND MSG', req.body)
  if (!message || !userId) {
    console.log('Missing data message')
    return res.status(422).send({ error: 'Missing data' })
  } else if (
    user.chats[userId] &&
    user.chats[userId].chatId &&
    user.chats[userId].chatId !== chatId
  ) {
    console.log('CHat id invalid')
    return res.status(422).send({ error: 'Error' })
  } else if (!user.chats[userId]) {
    let newMessage = {
      sent: new Date(),
      read: false,
      message: message,
      from: user.uid,
      to: userId,
      users: [user.uid, userId],
    }

    let newChat = {
      lastMessageDate: new Date(),
      lastMessage: message,
      users: [userId, user.uid],
    }

    db.collection('chats')
      .add(newChat)
      .then((docRef) => {
        let chatId = docRef.id

        db.collection('chats')
          .doc(chatId)
          .collection('messages')
          .add(newMessage)
          .then((done) => {
            console.log('added new message')
            return true
          })
          .catch((err) => {
            console.error('Error writing document: ', err)
            return true
          })

        // now add chat ID to both user profiles.

        let updateDataOtherUser: any = {}

        updateDataOtherUser['chats.' + user.uid + '.chatId'] = chatId
        updateDataOtherUser['chats.' + user.uid + '.lastMessageDate'] = new Date()
        updateDataOtherUser['chats.' + user.uid + '.unreadMessageCount'] = 0
        updateDataOtherUser['chats.' + user.uid + '.lastMessage'] = message
        updateDataOtherUser['chats.' + user.uid + '.archived'] = false
        updateDataOtherUser['chats.' + user.uid + '.username'] = user.username

        db.collection('users')
          .doc(userId)
          .update(updateDataOtherUser, { merge: true })
          .then((done) => {
            console.log('Updated profile')
            return true
          })
          .catch((err) => {
            console.error('Error writing document: ', err)
            return true
          })
        let updateData: any = {}

        updateData['chats.' + userId + '.chatId'] = chatId
        updateData['chats.' + userId + '.lastMessageDate'] = new Date()
        updateData['chats.' + userId + '.unreadMessageCount'] = 0
        updateData['chats.' + userId + '.lastMessage'] = message
        updateData['chats.' + userId + '.archived'] = false
        updateData['chats.' + userId + '.username'] = username

        db.collection('users')
          .doc(user.uid)
          .update(updateData, { merge: true })
          .then((done) => {
            console.log('Updated profile')
            return true
          })
          .catch((err) => {
            console.error('Error writing document: ', err)
            return true
          })

        // todo: this is async, would be better to refactor
        sendNewMessageReceivedNotifcation({
          recipientId: userId,
          displayName: user.displayName,
          message,
          pushData: newMessage,
        })

        return res.json({ chatId })
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
      })
  } else {
    let newMessage = {
      sent: new Date(),
      read: false,
      message: message,
      from: user.uid,
      to: userId,
      users: [user.uid, userId],
    }

    db.collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(newMessage)
      .then((done) => {
        console.log('added new message')

        // here we jsut update the last message stuff like date
        let updateDataOtherUser: any = {}
        updateDataOtherUser['chats.' + user.uid + '.lastMessageDate'] = new Date()
        updateDataOtherUser['chats.' + user.uid + '.unreadMessageCount'] = FieldValue.increment(1)
        updateDataOtherUser['chats.' + user.uid + '.lastMessage'] = message
        updateDataOtherUser['chats.' + user.uid + '.username'] = user.username

        db.collection('users')
          .doc(userId)
          .update(updateDataOtherUser, { merge: true })
          .then((done) => {
            console.log('Updated profile')
            return true
          })
          .catch((err) => {
            console.error('Error writing document: ', err)
            return true
          })

        let updateData: any = {}
        updateData['chats.' + userId + '.lastMessageDate'] = new Date()
        updateData['chats.' + userId + '.lastMessage'] = message
        updateData['chats.' + userId + '.username'] = username

        db.collection('users')
          .doc(user.uid)
          .update(updateData, { merge: true })
          .then((done) => {
            console.log('Updated profile')
            return true
          })
          .catch((err) => {
            console.error('Error writing document: ', err)
            return true
          })

        let chatUpdate = {
          lastMessageDate: new Date(),
          lastMessage: message,
        }

        db.collection('chats')
        .doc(chatId)
        .update(chatUpdate)
        .then((done) => {
          console.log('Updated profile')
          return true
        })
        .catch((err) => {
          console.error('Error writing document: ', err)
          return true
        })

        // todo: this is async, would be better to refactor
        sendNewMessageReceivedNotifcation({
          recipientId: userId,
          displayName: user.displayName,
          message,
          pushData: newMessage,
        })

        return res.send('OK')
      })
      .catch((err) => {
        return res.status(422).send({ error: err })
      })
  }
}
