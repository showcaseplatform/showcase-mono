import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { FlatGrid } from 'react-native-super-grid'
import { NavigationProp } from '@react-navigation/native'
import { TouchableOpacity } from '@gorhom/bottom-sheet' // https://gorhom.github.io/react-native-bottom-sheet/troubleshooting/#pressables--touchables-are-not-working-on-android

import { BottomSheetWrapper } from '../../../components/ScreenWrapper.component'
import { useMyBottomSheet } from '../../../utils/useMyBottomSheet'
import BottomSheetHeader from '../../authentication/components/BottomSheetHeader.component'

import { BadgeCategory, categories } from '../../../utils/helpers'
import { translate } from '../../../utils/translator'
import { TabStackParamList } from '../../../infrastructure/navigation/tab.navigator'

import { CenterView } from '../../../components/CenterView.component'
import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'

const CategorySelectorModal = ({
  navigation,
}: {
  navigation: NavigationProp<TabStackParamList>
}) => {
  const { collapse } = useMyBottomSheet()

  const itemWidth = useMemo(
    () => (Dimensions.get('window').width - 10 * 2 - 40) / 3, // 2x screen margin - item margin / 3 cols
    []
  )

  function handleNavigateToTrade() {
    collapse()
    setTimeout(() => {
      return navigation.navigate('TradeNavigator', {
        screen: 'TradeBadge',
      })
    }, 200)
  }

  function handleNavigateToEditor(category: BadgeCategory) {
    collapse()
    setTimeout(() => {
      return navigation.navigate('EditorNavigator', {
        screen: 'CreateBadge',
        params: { category },
      })
    }, 200)
  }

  return (
    <BottomSheetWrapper>
      <BottomSheetHeader title="createCategoryHeader" />
      <FlatGrid
        itemDimension={itemWidth}
        data={categories}
        additionalRowStyle={{ marginBottom: '10%' }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleNavigateToEditor(item)}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <LinearGradient
              start={[0, 0]}
              end={[1, 1]}
              colors={item.gradientColors}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name={item.iconName} size={36} color={'#fff'} />
            </LinearGradient>
            <Spacer position="top" size="medium">
              <Text color="grey" uppercase>
                {item.label}
              </Text>
            </Spacer>
          </TouchableOpacity>
        )}
      />
      <CenterView>
        <TouchableOpacity onPress={handleNavigateToTrade}>
          <Text color="grey">{translate().goToTrade}</Text>
        </TouchableOpacity>
      </CenterView>
    </BottomSheetWrapper>
  )
}

export default CategorySelectorModal
