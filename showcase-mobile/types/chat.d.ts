type UserChat = {
  unreadMessageCount: number
  lastMessage: string
  chatId: string
  username: string
  lastMessageDate: {
    _seconds: number
    _nanoseconds: number
  }
}

export type UserChats = {
  [key: string]: UserChat
}

export interface UserChatTransformed extends UserChat {
  partnerId: string
}
