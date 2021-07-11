import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { IconButton } from 'react-native-paper'

import LoadingIndicator from '../../components/LoadingIndicator.component'
import EditUserProfileScreen from '../../features/user/screens/EditUserProfile.screen'
import UserFollowersScreen from '../../features/user/screens/UserFollowers.screen'
import UserFriendsScreen from '../../features/user/screens/UserFriends.screen'
import UserProfileScreen from '../../features/user/screens/UserProfile.screen'
import { FollowStatus, useMeQuery } from '../../generated/graphql'
import UserSettingsNavigator from './userSettings.navigator'
import Error from '../../components/Error.component'
import { MyUser } from '../../../types'

const UserStack = createStackNavigator<UserStackParamList>()

export type UserStackParamList = {
  UserProfile: undefined
  EditUserProfile: {
    user: MyUser
  }
  UserFriends: {
    userFollowingCount: number
  }
  UserFollowers: {
    userFollowersCount: number
  }
  UserSettings: undefined
}

const UserNavigator = () => {
  const { data, loading } = useMeQuery()

  // todo: temp counters
  const friendsLength = data?.me.friends.filter(
    (f) => f.status === FollowStatus.Accepted
  ).length
  const followersLength = data?.me.followers.filter(
    (f) => f.status === FollowStatus.Accepted
  ).length

  // ?: does not update UI properly
  // const friendsLength = data?.me.friendsCount
  // const followersLength = data?.me.followersCount

  if (loading) {
    return <LoadingIndicator fullScreen />
  }

  if (data?.me) {
    return (
      <UserStack.Navigator>
        <UserStack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={({ navigation }) => ({
            title: data.me.profile?.username || data.me.id,
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="dots-vertical"
                color={tintColor}
                onPress={() => navigation.navigate('UserSettings')}
              />
            ),
          })}
        />
        <UserStack.Screen
          name="UserFriends"
          component={UserFriendsScreen}
          options={() => ({
            title: `Following (${friendsLength})`,
            headerTintColor: '#000',
            headerBackTitleVisible: false,
          })}
        />
        <UserStack.Screen
          name="UserFollowers"
          component={UserFollowersScreen}
          options={() => ({
            title: `Followers (${followersLength})`,
            headerTintColor: '#000',
            headerBackTitleVisible: false,
          })}
        />
        <UserStack.Screen
          name="EditUserProfile"
          component={EditUserProfileScreen}
          options={() => ({
            title: 'Edit Profile',
            headerBackTitleVisible: false,
            headerTintColor: '#000',
          })}
        />
        <UserStack.Screen
          name="UserSettings"
          component={UserSettingsNavigator}
          options={() => ({
            headerShown: false,
          })}
        />
      </UserStack.Navigator>
    )
  } else {
    return <Error />
  }
}

export default UserNavigator
