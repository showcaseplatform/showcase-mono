export interface Chat {
    id: {
      archived: boolean
      chatId: string
      lastMessage: string
      lastMessageDate: Date
      unreadMessageCount: number
      username: string
    }
  }