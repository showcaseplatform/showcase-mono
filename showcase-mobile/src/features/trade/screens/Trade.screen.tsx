import React from 'react'
import { Dimensions } from 'react-native'
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarItem,
  TabView,
} from 'react-native-tab-view'
import { useTheme } from 'styled-components/native'

import { StyledSafeArea } from '../../badges/screens/Badges.styles'
import Collection from './Collection.screen'
import Selling from './Selling.screen'
import Creations from './Creations.screen'

type TabRenderProps = SceneRendererProps & {
  navigationState: NavigationState<{
    key: string
    title: string
  }>
}

const initialLayout = { width: Dimensions.get('window').width }

const renderScene = SceneMap({
  collection: Collection,
  sales: Selling,
  myCreations: Creations,
})

const Trading = () => {
  const theme = useTheme()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'collection', title: 'Collection' },
    { key: 'sales', title: 'Selling' },
    { key: 'myCreations', title: 'My Creations' },
  ])

  const renderTabBar = (props: TabRenderProps) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.ui.accent }}
      style={{
        backgroundColor: theme.colors.bg.primary,
      }}
      scrollEnabled
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
        initialLayout={initialLayout}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
      />
    </StyledSafeArea>
  )
}

export default Trading
