import { Uid } from './user'

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

export interface SendMessageRequestBody {
  message: string
  userId: Uid
  username: string
  chatId: string
}
