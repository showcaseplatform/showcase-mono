import { NavigationProp, useIsFocused } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { FAB, Portal } from 'react-native-paper'
import EmptyListComponent from '../../../components/EmptyList.component'
import { SocialStackParamList } from '../../../infrastructure/navigation/social.navigator'
import { theme } from '../../../infrastructure/theme'
import {
  UserChats,
  UserChatTransformed,
} from '../../../services/authentication/authentication.context'
import useFuse from '../../../utils/useFuse'
import {
  SearchContainer,
  StyledSafeArea,
  StyledSearchbar,
} from '../../badges/screens/Badges.styles'
import ChatListItem from '../components/ChatListItem.component'

const mockedChat: UserChats = {
  '2109f006-d4bd-5a1f-a022-1385dd269560': {
    unreadMessageCount: 1,
    lastMessage: 'diszno diszko MArcival',
    chatId: 'someChatId',
    username: 'some username',
    lastMessageDate: {
      _seconds: 1610407038726,
      _nanoseconds: 0,
    },
  },
  'f1852ba9-4714-5f99-a259-f0640e71782c': {
    unreadMessageCount: 0,
    lastMessage:
      'diszno diszko PEtiveldfdsfjdsfldsfjdslfjdslflsdjfsldkfjslkdfjsdlkfjsldkfjslkfjslfdsjflsdkfjsdlfdjsl',
    chatId: 'someChatId2',
    username: 'some username2',
    lastMessageDate: {
      _seconds: 1510515038726,
      _nanoseconds: 0,
    },
  },
}

// !: temp
const chatsArr: UserChatTransformed[] = Object.keys(mockedChat).map((key) => ({
  partnerId: key,
  ...mockedChat[key],
}))

const searchKeys = ['username', 'lastMessage']

const ChatListScreen = ({
  navigation,
}: {
  navigation: NavigationProp<SocialStackParamList>
}) => {
  const fuseOptions = useMemo(
    () =>
      ({
        keys: searchKeys,
        threshold: 0.4,
        includeScore: true,
      } as const),
    [] // array of strings as input
  )
  const [searchResults, query, setQuery] = useFuse(chatsArr, fuseOptions)
  const isFocused = useIsFocused()

  return (
    <StyledSafeArea>
      <SearchContainer>
        <StyledSearchbar
          value={query}
          onChangeText={setQuery}
          placeholder="Search your chats"
          clearButtonMode="unless-editing"
        />
      </SearchContainer>
      <FlatList
        style={{ flex: 1 }}
        data={query ? searchResults : chatsArr}
        renderItem={({ item }) => (
          <ChatListItem
            item={item}
            onPress={() => navigation.navigate('Chat', { chatId: item.chatId })}
          />
        )}
        ListEmptyComponent={() => <EmptyListComponent text="chat not found" />}
        keyExtractor={(item) => item.chatId}
      />
      <Portal>
        <FAB
          icon="plus"
          animated={true}
          visible={isFocused}
          style={{
            position: 'absolute',
            bottom: '12%',
            right: 16,
            backgroundColor: theme.colors.ui.accent,
          }}
          color="white"
          onPress={() => navigation.navigate('FindFriend')}
        />
      </Portal>
    </StyledSafeArea>
  )
}

export default ChatListScreen
