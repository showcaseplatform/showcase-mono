import { User, UserType } from '@prisma/client'
import { Mutation, Arg, Resolver, Authorized, Subscription, Root } from 'type-graphql'
import { sendMessage } from '../libs/chat/sendMessage'
import { NewChatMessageInput, ExistingChatMessageInput } from '../libs/chat/types/sendMessage.type'
import { ChatMessage, ChatParticipant } from '@generated/type-graphql'
import { GraphQLError } from 'graphql'
import { readChatMessages } from '../libs/chat/readChatMessages'
import { addNewChatParticipant } from '../libs/chat/addNewChatParticipant'
import { AddNewChatParticipantInput } from '../libs/chat/types/addNewChatParticipant.type'
import { isChatParticipant } from '../libs/chat/validateChatParticipant'
import { myPubSub, NEW_CHAT_MESSAGE } from '../services/pubSub'
import { CurrentUser } from '../libs/auth/decorators'

@Resolver()
export class ChatResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => ChatMessage)
  async sendMessage(
    @CurrentUser() currentUser: User,
    @Arg('newChatInput', { nullable: true }) newChatInput?: NewChatMessageInput,
    @Arg('existingChatInput', { nullable: true }) existingChatInput?: ExistingChatMessageInput
  ): Promise<ChatMessage> {
    const input = newChatInput || existingChatInput
    if (!input) {
      throw new GraphQLError('Please provide an input data')
    }
    const message = await sendMessage(input, currentUser)
    await myPubSub.publish(NEW_CHAT_MESSAGE, message)
    return message
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => [ChatMessage])
  async readChatMessages(
    @Arg('chatId') chatId: string,
    @CurrentUser() currentUser: User
  ): Promise<ChatMessage[]> {
    return await readChatMessages(chatId, currentUser)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation(() => ChatParticipant)
  async addNewChatParticipant(
    @Arg('data') input: AddNewChatParticipantInput,
    @CurrentUser() currentUser: User
  ): Promise<ChatParticipant> {
    return await addNewChatParticipant(input, currentUser)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Subscription({
    topics: NEW_CHAT_MESSAGE,
    filter: async ({ context, payload }: { context: { user: User }; payload: ChatMessage }) => {
      return await isChatParticipant(payload.chatId, context.user.id)
    },
  })
  newChatMessage(@Root() payload: ChatMessage): ChatMessage {
    return { ...payload }
  }
}
