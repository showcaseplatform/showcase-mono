import { createStackNavigator } from '@react-navigation/stack'
import { GLSnapshot } from 'expo-gl'
import React from 'react'
import AddBadgeDetails from '../../features/createBadge/screens/AddBadgeDetails.screen'
import CreateBadge from '../../features/createBadge/screens/CreateBadge.screen'
import SelectCause from '../../features/createBadge/screens/SelectCause.screen'
import { Category } from '../../generated/graphql'
import { translate } from '../../utils/translator'

const EditorStack = createStackNavigator<EditorStackParamList>()

export type EditorStackParamList = {
  CreateBadge: {
    // Todo: rename to BadgeEditor
    category: Category
  }
  SelectCause: {
    category: Category
    imagePath: string
    image: GLSnapshot
  }
  AddBadgeDetails: {
    // Todo: rename CreateBadge
    category: Category
    imagePath: string
    image: GLSnapshot
    donation: {
      causeId?: number
      donationPercent?: number // !: currently eg. 30%
    }
  }
}

const EditorNavigator = () => {
  return (
    <EditorStack.Navigator>
      <EditorStack.Screen
        name="CreateBadge"
        component={CreateBadge}
        options={() => ({
          title: translate().creatorHeader,
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        })}
      />
      <EditorStack.Screen
        name="SelectCause"
        component={SelectCause}
        options={() => ({
          title: translate().causeChooseHeader,
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        })}
      />
      <EditorStack.Screen
        name="AddBadgeDetails"
        component={AddBadgeDetails}
        options={() => ({
          title: translate().publishHeader,
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        })}
      />
    </EditorStack.Navigator>
  )
}

export default EditorNavigator
