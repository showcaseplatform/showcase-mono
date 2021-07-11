import { createStackNavigator } from '@react-navigation/stack'
import { GLSnapshot } from 'expo-gl'
import React from 'react'
import AddBadgeDetails from '../../features/createBadge/screens/AddBadgeDetails.screen'
import CreateBadge from '../../features/createBadge/screens/CreateBadge.screen'
import SelectCause from '../../features/createBadge/screens/SelectCause.screen'
import { MyBadgeCategory } from '../../features/badges/components/CategorySelector.component'
import { translate } from '../../utils/translator'

const EditorStack = createStackNavigator<EditorStackParamList>()

export type EditorStackParamList = {
  CreateBadge: {
    category: MyBadgeCategory
  }
  SelectCause: {
    category: MyBadgeCategory
    imagePath: string
    image: GLSnapshot
  }
  AddBadgeDetails: {
    category: MyBadgeCategory
    imagePath: string
    image: GLSnapshot
    donation: {
      causeId?: number
      donationPercent?: number // ?: FLOAT
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
