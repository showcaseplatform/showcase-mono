import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import TradeBadgeScreen from '../../features/trade/screens/TradeBadge.screen'
import TradeBadgeDetailsScreen from '../../features/trade/screens/TradeBadgeDetails.screen'
import { MyBadgeType } from '../../features/badges/components/BadgeItem.component'

const TradeStack = createStackNavigator<TradeStackParamList>()

export type TradeStackParamList = {
  TradeBadge: undefined
  TradeBadgeDetails: {
    item: MyBadgeType
  }
}

const TradeNavigator = () => {
  return (
    <TradeStack.Navigator
      headerMode="screen"
      screenOptions={{ headerTintColor: '#000' }}
    >
      <TradeStack.Screen
        name="TradeBadge"
        options={{ headerShown: false }}
        component={TradeBadgeScreen}
      />
      <TradeStack.Screen
        name="TradeBadgeDetails"
        component={TradeBadgeDetailsScreen}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerTitle: route.params?.item.title,
        })}
      />
    </TradeStack.Navigator>
  )
}

export default TradeNavigator
