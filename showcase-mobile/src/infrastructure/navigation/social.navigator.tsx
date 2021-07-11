import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChatScreen from '../../features/social/screens/Chat.screen'
import ChatListScreen from '../../features/social/screens/ChatList.screen'

const SocialStack = createStackNavigator<SocialStackParamList>()

export type SocialStackParamList = {
  ChatList: undefined
  Chat: {
    chatId: string
  }
  FindFriend: undefined
}

const SocialNavigator = () => {
  return (
    <SocialStack.Navigator>
      <SocialStack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <SocialStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerTintColor: '#000',
          headerBackTitleVisible: false,
          title: route.params?.chatId,
        })}
      />
      {/* <SocialStack.Screen
        name="FindFriend"
        component={FindFriendScreen}
        options={() => ({
          headerTintColor: '#000',
          headerBackTitleVisible: false,
          title: 'Find a friend',
        })}
      /> */}
    </SocialStack.Navigator>
  )
}

export default SocialNavigator
