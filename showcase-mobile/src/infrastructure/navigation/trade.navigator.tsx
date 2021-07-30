import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Trading from '../../features/trade/screens/Trade.screen'
import TradeItemDetails from '../../features/trade/screens/TradeItemDetails.screen'
import TradeTypeDetails from '../../features/trade/screens/TradeTypeDetails.screen'

const TradeStack = createStackNavigator<TradeStackParamList>()

export type TradeStackParamList = {
  Trade: undefined
  TradeItemDetails: {
    id: string
    itemId: string
  }
  TradeTypeDetails: {
    id: string
  }
}

const TradeNavigator = () => {
  return (
    <TradeStack.Navigator
      headerMode="screen"
      screenOptions={{ headerTintColor: '#000', headerBackTitleVisible: false }}
    >
      <TradeStack.Screen
        name="Trade"
        options={{ headerShown: false }}
        component={Trading}
      />
      <TradeStack.Screen name="TradeItemDetails" component={TradeItemDetails} />
      <TradeStack.Screen name="TradeTypeDetails" component={TradeTypeDetails} />
    </TradeStack.Navigator>
  )
}

export default TradeNavigator
