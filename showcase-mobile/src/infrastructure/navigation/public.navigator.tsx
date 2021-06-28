import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useCallback } from 'react'
import AuthenticationFlow from '../../features/authentication/components/AuthenticationFlow.component'
import { useMyBottomSheet } from '../../utils/useMyBottomSheet'
import { BadgesNavigator } from '../navigation/badges.navigator'
import { createScreenOptions, tabBarOptions } from './tab.navigator'

type TabStackParamList = {
  BadgeNavigator: undefined
  Notifications: undefined
  TradeNavigator: undefined
  Social: undefined
  UserNavigator: undefined
}

const Tab = createBottomTabNavigator<TabStackParamList>()

const NullScreen = () => null

// todo: replace null screen tabs with fake icons and tabs with showAuthModal listener (aka. custom bottomTab component)
export const PublicTabNavigator = () => {
  const { expand } = useMyBottomSheet()

  const showAuthModal = useCallback(
    () =>
      expand({
        children: <AuthenticationFlow />,
        snapPoints: [0, '60%'],
      }),
    [expand]
  )
  const authListener = useCallback(
    () => ({
      tabPress: (e: any) => {
        e.preventDefault()
        showAuthModal()
      },
    }),
    [showAuthModal]
  )

  return (
    <>
      <Tab.Navigator
        tabBarOptions={tabBarOptions}
        screenOptions={createScreenOptions}
      >
        <Tab.Screen name="BadgeNavigator" component={BadgesNavigator} />
        <Tab.Screen
          name="Notifications"
          component={NullScreen}
          listeners={authListener}
        />
        <Tab.Screen
          name="TradeNavigator"
          component={NullScreen}
          listeners={authListener}
        />
        <Tab.Screen
          name="Social"
          component={NullScreen}
          listeners={authListener}
        />
        <Tab.Screen
          name="UserNavigator"
          component={NullScreen}
          listeners={authListener}
        />
      </Tab.Navigator>
    </>
  )
}
