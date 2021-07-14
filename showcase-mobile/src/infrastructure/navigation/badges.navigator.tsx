import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import BadgesScreen from '../../features/badges/screens/Badges.screen'
import BadgeDetailsScreen from '../../features/badges/screens/BadgeDetails.screen'
import { Alert } from 'react-native'
import ProfileScreen from '../../features/badges/screens/Profile.screen'
import { IconButton } from 'react-native-paper'
import { BadgeType } from '../../generated/graphql'

export type BadgeStackParamList = {
  Badges: undefined
  BadgeDetails: {
    item: BadgeType
  }
  Profile: {
    userId: string
  }
}

const BadgesStack = createStackNavigator<BadgeStackParamList>()

export const BadgesNavigator = () => (
  <BadgesStack.Navigator
    screenOptions={{
      headerShown: false,
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    }}
  >
    <BadgesStack.Screen name="Badges" component={BadgesScreen} />
    <BadgesStack.Screen
      name="BadgeDetails"
      component={BadgeDetailsScreen}
      options={({ route }) => ({
        title: route.params?.item.title,
        headerShown: true,
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerTintColor: '#FFF',
      })}
    />
    <BadgesStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={() => ({
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerRight: ({ tintColor }) => (
          <IconButton
            color={tintColor}
            icon="flag-outline"
            onPress={() =>
              Alert.alert('this should open somekind of report abusive user')
            }
          />
        ),
      })}
    />
  </BadgesStack.Navigator>
)
