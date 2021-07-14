import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Text } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { CenterView } from '../../../components/CenterView.component'

import { TabStackParamList } from '../../../infrastructure/navigation/tab.navigator'
import { translate } from '../../../utils/translator'
import { useMyBottomSheet } from '../../../utils/useMyBottomSheet'
import CategorySelectorBottomSheet from './CategorySelectorModal.component'

const StyledTouchableWithoutFeedback = styled.TouchableOpacity`
  width: 68px;
  height: 68px;
  margin-top: -25px;
  border-radius: 34px;
  overflow: hidden;
`

const InnerWrapper = styled(CenterView)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.ui.accent};
`

const CreateBadgeButton = () => {
  const { expand } = useMyBottomSheet()
  const navigation: NavigationProp<TabStackParamList> = useNavigation()
  const theme = useTheme()

  const showCategorySelectorSheet = useCallback(() => {
    expand({
      children: <CategorySelectorBottomSheet navigation={navigation} />,
      snapPoints: [0, '80%'],
    })
  }, [expand, navigation])

  return (
    <StyledTouchableWithoutFeedback onPress={showCategorySelectorSheet}>
      <InnerWrapper>
        <Ionicons
          name="cloud-upload"
          size={28}
          color={theme.colors.text.secondary}
        />
        <Text style={{ color: theme.colors.text.secondary }}>
          {translate().myCreator}
        </Text>
      </InnerWrapper>
    </StyledTouchableWithoutFeedback>
  )
}

export default CreateBadgeButton
