import React from 'react'
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from 'react-native-tab-view'
import { Ionicons } from '@expo/vector-icons'
import styled, { useTheme } from 'styled-components/native'
import { IonIconName } from '../../../utils/helpers'

export type TabRouteProps = {
  key: string
  icon: IonIconName
}

const StyledTabBar = styled(TabBar)`
  width: 40%;
  margin-left: auto;
  margin-right: auto;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`

export const EditorTab = (
  props: SceneRendererProps & {
    navigationState: NavigationState<TabRouteProps>
  }
) => {
  const theme = useTheme()
  return (
    <StyledTabBar
      {...props}
      renderIcon={({ route, focused, color }) => (
        <Ionicons
          name={(focused ? route.icon : `${route.icon}-outline`) as IonIconName}
          size={30}
          color={color}
        />
      )}
      activeColor={theme.colors.ui.accent}
      inactiveColor={theme.colors.text.primary}
      indicatorStyle={{ backgroundColor: theme.colors.ui.accent }}
    />
  )
}
