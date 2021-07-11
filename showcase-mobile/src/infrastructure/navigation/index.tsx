import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
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

// todo: extract base navi from here
const NavigationRoot = () => {
  const token = useToken()

  return (
    <NavigationContainer linking={linking}>
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
