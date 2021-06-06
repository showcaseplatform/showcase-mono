import { User } from '@prisma/client'
import prisma from '../../services/prisma'
import { validateChatParticipant } from './validateChatParticipant'

export const readChatMessages = async (chatId: string, user: User) => {

  await validateChatParticipant(chatId, user.id)

  const unreadMessages = await prisma.chatMessage.findMany({
    where: {
      chatId,
      fromId: {
        not: user.id,
      },
    },
  })

  const readData = unreadMessages.map((m) => {
    return { messageId: m.id, readById: user.id }
  })

  await prisma.chatMessageRead.createMany({
    data: readData,
  })

  return unreadMessages
}
