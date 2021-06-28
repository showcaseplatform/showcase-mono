import { NavigationProp } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { FlatList } from 'react-native-gesture-handler'

import { SocialStackParamList } from '../../../infrastructure/navigation/social.navigator'
import { Profile2 } from '../../../services/profile.service'
import useFuse from '../../../utils/useFuse'
import { EmptyListComponent } from '../../badges/screens/Badges.screen'
import {
  SearchContainer,
  StyledSafeArea,
  StyledSearchbar,
} from '../../badges/screens/Badges.styles'
import FindFriendItem from '../components/FindFriendItem.component'

const searchKeys = ['username']

// todo: mocked profile data arr til backend is ready
export type PickedProfileProps = Pick<
  Profile2,
  'uid' | 'username' | 'avatar' | 'email' | 'creator'
>

const mockedProfiles: PickedProfileProps[] = [
  {
    uid: '1',
    username: 'Belus',
    avatar: '',
    email: 'x@x.com',
    creator: false,
  },
  {
    uid: '2',
    username: 'Sanyika',
    avatar: '',
    email: 'y@x.com',
    creator: true,
  },
]

const FindFriendScreen = ({
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
  const [searchResults, query, setQuery] = useFuse(mockedProfiles, fuseOptions)

  return (
    <StyledSafeArea>
      <SearchContainer>
        <StyledSearchbar
          value={query}
          onChangeText={setQuery}
          placeholder="Find a friend"
        />
      </SearchContainer>
      <FlatList
        style={{ flex: 1 }}
        data={query ? searchResults : mockedProfiles}
        renderItem={({ item }) => (
          <FindFriendItem
            item={item}
            onPress={() => navigation.navigate('Chat', { chatId: item.chatId })}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyListComponent text="profile not found" />
        )}
        keyExtractor={(item) => item.uid}
      />
    </StyledSafeArea>
  )
}

export default FindFriendScreen
