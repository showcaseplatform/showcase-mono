import { UserType } from '@prisma/client'
import { Mutation, Arg, Resolver, Ctx, Authorized } from 'type-graphql'
import { sendMessage } from '../libs/chat/sendMessage'
import { NewChatMessageInput, ExistingChatMessageInput } from '../libs/chat/types/sendMessage.type'
import { ChatMessage, ChatParticipant } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'
import { readChatMessages } from '../libs/chat/readChatMessages'
import { addNewChatParticipant } from '../libs/chat/addNewChatParticipant'
import { AddNewChatParticipantInput } from '../libs/chat/types/addNewChatParticipant.type'

@Resolver()
export class ChatResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => ChatMessage)
  async sendMessage(
    @Ctx() ctx: any,
    @Arg('newChatInput', { nullable: true }) newChatInput?: NewChatMessageInput,
    @Arg('existingChatInput', { nullable: true }) existingChatInput?: ExistingChatMessageInput
  ) {
    const input = newChatInput || existingChatInput
    if (!input) throw new GraphQLError('Please provide an input data')
    return await sendMessage(input, ctx.user)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => [ChatMessage])
  async readChatMessages(@Ctx() ctx: any, @Arg('chatId') chatId: string) {
    return await readChatMessages(chatId, ctx.user)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => ChatParticipant)
  async addNewChatParticipant(@Ctx() ctx: any, @Arg('data') input: AddNewChatParticipantInput) {
    return await addNewChatParticipant(input, ctx.user)
  }
}
