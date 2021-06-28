import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons'

import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { IonIconName } from '../../../utils/helpers'
import { ImageSourcePropType } from 'react-native'

const IconWrapper = styled.View<{ active: boolean }>`
  width: 65px;
  height: 65px;
  justify-content: center;
  align-items: center;
  border-radius: 35px;
  border-width: 2px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-color: ${({ active, theme }) =>
    active ? theme.colors.ui.accent : theme.colors.ui.disabledLight};
  overflow: hidden;
`

const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
`

type FilterSelectorProps = {
  active: boolean
  label: string
  setActive: () => void
  iconName?: IonIconName
  imageSrc?: ImageSourcePropType
}

export const FilterSelector = ({
  label,
  iconName,
  active,
  imageSrc,
  setActive,
}: FilterSelectorProps) => {
  return (
    <TouchableOpacity onPress={setActive}>
      <IconWrapper active={active}>
        {iconName && <Ionicons name={iconName} size={42} />}
        {imageSrc && <StyledImage source={imageSrc} resizeMode="contain" />}
      </IconWrapper>
      <Spacer size="medium" />
      <Text
        center
        uppercase
        bold
        variant="caption"
        color={active ? 'accent' : 'grey'}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}
