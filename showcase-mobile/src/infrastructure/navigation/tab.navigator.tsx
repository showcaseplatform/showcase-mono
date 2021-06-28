import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteProp } from '@react-navigation/core'
import CreateBadgeButton from '../../features/createBadge/components/CreateBadgeButton.component'
import NotificationsScreen from '../../features/notifications/screens/Notifications.screen'
import { BadgesNavigator } from '../navigation/badges.navigator'
import SocialNavigator from './social.navigator'
import TradeNavigator from './trade.navigator'
import UserNavigator from './user.navigator'
import { useMeQuery, UserType } from '../../generated/graphql'
import LoadingIndicator from '../../components/LoadingIndicator.component'

export type TabStackParamList = {
  BadgeNavigator: undefined
  Notifications: undefined
  TradeNavigator: undefined
  Social: undefined
  UserNavigator: {
    userId: string
  }
}
type IonIconName = React.ComponentProps<typeof Ionicons>['name']

const TAB_ICON: {
  [key in keyof TabStackParamList]: IonIconName
} = {
  BadgeNavigator: 'ios-home',
  Notifications: 'ios-notifications',
  TradeNavigator: 'swap-horizontal-outline',
  Social: 'chatbubbles-outline',
  UserNavigator: 'ios-trophy',
}

const TAB_LABEL: { [key in keyof TabStackParamList]: string } = {
  BadgeNavigator: 'Feed',
  Notifications: 'Notifications',
  TradeNavigator: 'Trade',
  Social: 'Chat',
  UserNavigator: 'Showcase',
}

export const createScreenOptions = ({
  route,
  isCreator,
}: {
  route: RouteProp<TabStackParamList, keyof TabStackParamList>
  isCreator?: boolean
}) => {
  const iconName: IonIconName = TAB_ICON[route.name]
  const tabBarLabel = TAB_LABEL[route.name]

  if (isCreator && route.name === 'TradeNavigator') {
    return {
      tabBarButton: CreateBadgeButton,
    }
  } else {
    return {
      tabBarIcon: ({ size, color }: { size: number; color: string }) => (
        <Ionicons name={iconName} size={size} color={color} />
      ),
      tabBarLabel,
    }
  }
}

// !: hex colors does not work, fix later
// todo: extract me when theming
export const tabBarOptions = {
  activeTintColor: 'rgb(38,13,105)',
  inactiveTintColor: 'rgb(135,135,135)',
}

const Tab = createBottomTabNavigator<TabStackParamList>()

export const TabNavigator = () => {
  const [{ data, fetching }] = useMeQuery()
  const isCreator = data?.me.userType === UserType.Creator

  if (fetching) return <LoadingIndicator fullScreen />

  return (
    <Tab.Navigator
      tabBarOptions={tabBarOptions}
      screenOptions={({ route: r }) =>
        createScreenOptions({ route: r, isCreator })
      }
    >
      <Tab.Screen name="BadgeNavigator" component={BadgesNavigator} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="TradeNavigator" component={TradeNavigator} />
      <Tab.Screen name="Social" component={SocialNavigator} />
      <Tab.Screen name="UserNavigator" component={UserNavigator} />
    </Tab.Navigator>
  )
}
