import { User } from '@prisma/client'
import prisma from '../../services/prisma'
import { AddNewChatParticipantInput } from './types/addNewChatParticipant.type'
import { validateChatParticipant } from './validateChatParticipant'



export const addNewChatParticipant = async (input: AddNewChatParticipantInput, user: User) => {
  const { chatId, participantId } = input

  await validateChatParticipant(chatId, user.id)

  return await prisma.chatParticipant.create({
    data: {
      chatId,
      userId: participantId,
    },
  })
}
