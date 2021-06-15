import { GraphQLError } from 'graphql'
import { prisma } from '../../services/prisma'
import { Uid } from '../../types/user'

export const validateChatParticipant = async (chatId: string, userId: Uid) => {
  const chatParticipant = await prisma.chatParticipant.findUnique({
    where: {
      chatId_userId: {
        chatId,
        userId,
      },
    },
  })

  if (!chatParticipant) {
    throw new GraphQLError('User is not participant in chat')
  }
}

export const isChatParticipant = async(chatId: string, userId: Uid) => {
 try {
   await validateChatParticipant(chatId, userId)
   return true
 } catch (_) {
   return false
 }
}
