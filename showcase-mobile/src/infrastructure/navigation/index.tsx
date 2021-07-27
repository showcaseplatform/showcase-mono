import React, { createRef } from 'react'
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { linking } from './linking.configuration'

import EditorNavigator from './editor.navigator'
import { PublicTabNavigator } from './public.navigator'
import { TabNavigator } from './tab.navigator'
import { useToken } from '../../services/persistence/token'

const ProtectedStack = createStackNavigator<ProtectedStackParamList>()

export type ProtectedStackParamList = {
  EditorNavigator: undefined
  TabNavigator: undefined
}

export const navigationRef = createRef<NavigationContainerRef>()

export function navigate(name: string, params: object | undefined) {
  navigationRef.current?.navigate(name, params)
}

// todo: extract base navi from here
const NavigationRoot = () => {
  const token = useToken()

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      {token ? (
        <ProtectedStack.Navigator screenOptions={{ headerShown: false }}>
          <ProtectedStack.Screen name="TabNavigator" component={TabNavigator} />
          <ProtectedStack.Screen
            name="EditorNavigator"
            component={EditorNavigator}
          />
        </ProtectedStack.Navigator>
      ) : (
        <PublicTabNavigator />
      )}
    </NavigationContainer>
  )
}

export default NavigationRoot
