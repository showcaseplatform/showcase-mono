import React from 'react'
import { FlatList } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'

import { FollowStatus, useMeQuery } from '../../../generated/graphql'
import { UserStackParamList } from '../../../infrastructure/navigation/user.navigator'

import EmptyListComponent from '../../../components/EmptyList.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import FollowItem from './components/FollowItem.component'

type UserFollowersScreenProps = {
  route: RouteProp<UserStackParamList, 'UserProfile'>
  navigation: NavigationProp<UserStackParamList>
}

const UserFollowersScreen = ({ navigation }: UserFollowersScreenProps) => {
  const { data, loading } = useMeQuery()

  if (loading) {
    return <LoadingIndicator fullScreen />
  }

  const acceptedFollowers = data?.me.followers.filter(
    (f) => f.status === FollowStatus.Accepted
  )

  return (
    <FlatList
      data={acceptedFollowers}
      keyExtractor={(follower) => follower.userId}
      renderItem={({ item: follower }) => (
        <FollowItem
          user={follower.user}
          onPress={() =>
            navigation.navigate('BadgeNavigator', {
              screen: 'Profile',
              params: { userId: follower.user.id },
            })
          }
          hasAction={false}
        />
      )}
      ListEmptyComponent={
        <EmptyListComponent text="no followers yet" iconName="people-outline" />
      }
    />
  )
}

export default UserFollowersScreen
