import { sendNewMessageReceivedNotifcations } from '../../libs/pushNotifications/newMessageReceived'
import prisma from '../../services/prisma'
import { ChatMessage, User } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { Uid } from '../../types/user'
import { validateChatParticipant } from './validateChatParticipant'
import { NewChatMessageInput, ExistingChatMessageInput } from './types/sendMessage.type'

const createNewChat = async (fromUserId: Uid, message: string, participantId: Uid) => {
  const newChatWithMessage = await prisma.chat.create({
    data: {
      messages: {
        create: {
          fromUserId,
          message,
        },
      },
      participants: {
        createMany: {
          data: [{ userId: participantId }, { userId: fromUserId }],
        },
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  })

  return newChatWithMessage.messages[0]
}

const getChatParticipantIds = async (chatId: string): Promise<Uid[]> => {
  const participants = await prisma.chatParticipant.findMany({
    where: {
      chatId,
    },
  })

  return participants.map((m) => m.userId)
}

const addNewMessageToChat = async (fromUserId: Uid, message: string, chatId: string) => {
  await validateChatParticipant(chatId, fromUserId)
  return await prisma.chatMessage.create({
    data: {
      chatId,
      fromUserId,
      message,
    },
  })
}

export const sendMessage = async (
  input: NewChatMessageInput | ExistingChatMessageInput,
  user: User
) => {
  const { message } = input

  let newMessage: ChatMessage
  const recipients: Uid[] = []

  if ((input as NewChatMessageInput)?.recipientId) {
    const { recipientId } = input as NewChatMessageInput
    newMessage = await createNewChat(user.id, message, recipientId)
    recipients.push(recipientId)
  } else if ((input as ExistingChatMessageInput)?.chatId) {
    const { chatId } = input as ExistingChatMessageInput
    newMessage = await addNewMessageToChat(user.id, message, chatId)
    const participantIds = await getChatParticipantIds(chatId)
    recipients.push(...participantIds)
  } else {
    throw new GraphQLError('Invalid input')
  }

  const senderProfile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  if (senderProfile) {
    const notificationMessages = recipients.map((id) => {
      return {
        recipientId: id,
        senderId: user.id,
        senderDisplayName: senderProfile.displayName,
        message,
        pushData: newMessage,
      }
    })

    // no await here, to return before new message notification send is resolved
    senderProfile && sendNewMessageReceivedNotifcations(notificationMessages)
  }

  return newMessage
}
