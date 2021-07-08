import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { MyBadgeCategory } from '../../../../types'
import { Category } from '../../../generated/graphql'

import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'
import { useTheme } from 'styled-components/native'

type CategoryItemProps = {
  category: MyBadgeCategory
  isActive: boolean
  onPress: (label?: Category) => void
}

export const CategoryItem = ({
  category,
  isActive,
  onPress,
}: CategoryItemProps) => {
  const { id, label, iconName, gradientColors } = category
  const theme = useTheme()

  return (
    <TouchableOpacity
      onPress={() => {
        isActive ? onPress(undefined) : onPress(label)
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
          borderWidth: 2,
          borderColor: isActive ? theme.colors.ui.accent : 'transparent',
        }}
      >
        <Ionicons
          name={iconName}
          size={36}
          color={theme.colors.text.secondary}
        />
      </LinearGradient>
      <Spacer position="top" size="medium">
        <Text variant="caption" color="grey" uppercase center>
          {label}
        </Text>
      </Spacer>
    </TouchableOpacity>
  )
}
