import React from 'react'
import { ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '../../../components/Text.component'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { LinearGradient } from 'expo-linear-gradient'
import { Spacer } from '../../../components/Spacer.component'
import { Category } from '../../../generated/graphql'
import { categories } from '../../../utils/helpers'

export interface MyBadgeCategory {
  id: number
  label: Category
  iconName: React.ComponentProps<typeof Ionicons>['name']
  gradientColors: string[]
}

type BadgeCategoryItemProps = {
  badgeCategory: MyBadgeCategory
  onPress: (label: Category) => void
}

const BadgeCategoryItem = ({
  badgeCategory,
  onPress,
}: BadgeCategoryItemProps) => {
  const { id, label, iconName, gradientColors } = badgeCategory
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(label)
      }}
      key={id}
      style={{
        marginHorizontal: 6,
      }}
    >
      <LinearGradient
        start={[0, 0]}
        end={[1, 1]}
        colors={gradientColors}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name={iconName} size={36} color={'#fff'} />
      </LinearGradient>
      <Spacer position="top" size="medium">
        <Text variant="caption" color="grey" uppercase center>
          {label}
        </Text>
      </Spacer>
    </TouchableOpacity>
  )
}

const CategorySelector = ({
  onSelect,
}: {
  onSelect: (label: Category) => void
}) => {
  return (
    <ScrollView
      horizontal
      centerContent
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
    >
      {categories.map((c) => (
        <BadgeCategoryItem badgeCategory={c} onPress={onSelect} key={c.id} />
      ))}
    </ScrollView>
  )
}

export default CategorySelector
