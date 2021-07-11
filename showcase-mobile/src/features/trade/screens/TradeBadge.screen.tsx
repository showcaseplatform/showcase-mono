import React from 'react'
import { Dimensions } from 'react-native'
import { SceneMap, TabBar, TabBarItem, TabView } from 'react-native-tab-view'
import { useTheme } from 'styled-components/native'

import { StyledSafeArea } from '../../badges/screens/Badges.styles'
import BadgeHistory from './BadgeHistory.screen'
import BadgeInventory from './BadgeInventory.screen'
import BadgeSales from './BadgeSales.screen'

const initialLayout = { width: Dimensions.get('window').width }

const renderScene = SceneMap({
  sales: BadgeSales,
  inventory: BadgeInventory,
  history: BadgeHistory,
})

const TradeBadgeScreen = () => {
  const theme = useTheme()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'sales', title: 'My Sales' },
    { key: 'inventory', title: 'Inventory' },
    { key: 'history', title: 'History' },
  ])

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.ui.accent }}
      style={{
        backgroundColor: theme.colors.bg.primary,
      }}
      activeColor={theme.colors.text.primary}
      inactiveColor={theme.colors.text.grey}
      indicatorContainerStyle={{ marginBottom: 5 }}
      renderTabBarItem={(props) => <TabBarItem {...props} />}
    />
  )

  return (
    <StyledSafeArea>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </StyledSafeArea>
  )
}

export default TradeBadgeScreen
