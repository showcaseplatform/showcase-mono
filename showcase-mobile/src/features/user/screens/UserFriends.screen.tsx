import React from 'react'
import { FlatList } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'

import { FollowStatus, useMeQuery } from '../../../generated/graphql'
import { UserStackParamList } from '../../../infrastructure/navigation/user.navigator'

import EmptyListComponent from '../../../components/EmptyList.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import FollowItem from './components/FollowItem.component'

type UserFriendsScreenProps = {
  route: RouteProp<UserStackParamList, 'UserProfile'>
  navigation: NavigationProp<UserStackParamList>
}

const UserFriendsScreen = ({ navigation }: UserFriendsScreenProps) => {
  const { data, loading } = useMeQuery()

  if (loading) {
    return <LoadingIndicator fullScreen />
  }

  const acceptedFriends = data?.me.friends.filter(
    (f) => f.status === FollowStatus.Accepted
  )

  return (
    <FlatList
      data={acceptedFriends}
      keyExtractor={(friend) => friend.userId}
      renderItem={({ item: friend }) => (
        <FollowItem
          user={friend.user}
          onPress={() =>
            navigation.navigate('BadgeNavigator', {
              screen: 'Profile',
              params: { userId: friend.user.id },
            })
          }
        />
      )}
      ListEmptyComponent={
        <EmptyListComponent text="no friends yet" iconName="people-outline" />
      }
    />
  )
}

export default UserFriendsScreen
