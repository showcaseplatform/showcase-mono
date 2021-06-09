import { User, UserType } from '@prisma/client'
import {
  Mutation,
  Arg,
  Resolver,
  Ctx,
  Authorized,
  Subscription,
  Root,
  PubSub,
  Publisher,
} from 'type-graphql'
import { sendMessage } from '../libs/chat/sendMessage'
import { NewChatMessageInput, ExistingChatMessageInput } from '../libs/chat/types/sendMessage.type'
import { ChatMessage, ChatParticipant } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'
import { readChatMessages } from '../libs/chat/readChatMessages'
import { addNewChatParticipant } from '../libs/chat/addNewChatParticipant'
import { AddNewChatParticipantInput } from '../libs/chat/types/addNewChatParticipant.type'
import { isChatParticipant } from '../libs/chat/validateChatParticipant'

const NEW_CHAT_MESSAGE_TOPIC = 'NEW_CHAT_MESSAGE'
@Resolver()
export class ChatResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => ChatMessage)
  async sendMessage(
    @Ctx() ctx: any,
    @PubSub(NEW_CHAT_MESSAGE_TOPIC) publish: Publisher<ChatMessage>,
    @Arg('newChatInput', { nullable: true }) newChatInput?: NewChatMessageInput,
    @Arg('existingChatInput', { nullable: true }) existingChatInput?: ExistingChatMessageInput
  ) {
    const input = newChatInput || existingChatInput
    if (!input) throw new GraphQLError('Please provide an input data')
    const message = await sendMessage(input, ctx.user)
    await publish(message)
    return message
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

  @Subscription({
    topics: NEW_CHAT_MESSAGE_TOPIC,
    filter: async ({ context, payload }: { context: { user: User }; payload: ChatMessage }) => {
      return await isChatParticipant(payload.chatId, context.user.id)
    },
  })
  newChatMessage(@Root() payload: ChatMessage): ChatMessage {
    return { ...payload }
  }
}