import React from 'react'
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons'
import { BadgeTabProps } from '../screens/Profile.screen'

const StyledTouchable = styled.TouchableOpacity<{ isActive: boolean }>`
  border-bottom-width: 1px;
  border-bottom-color: ${({ isActive }) => `${isActive ? 'black' : 'transparent'}`};
  padding-bottom: ${({ theme }) => theme.space[2]};
  padding-horizontal: ${({ theme }) => theme.space[3]};
`

export default ({ name, iconName, isActive, onPress }: BadgeTabProps) => (
  <StyledTouchable onPress={() => onPress(name)} isActive={isActive}>
    <Ionicons name={iconName} size={24} color={'#000'} />
  </StyledTouchable>
)
