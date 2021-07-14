import React from 'react'
import { Ionicons } from '@expo/vector-icons'

import { CenterView } from './CenterView.component'
import { Text } from './Text.component'
import { Spacer } from './Spacer.component'

const EmptyListComponent = ({
  text = 'no badges found :(',
  iconName = 'ios-images-outline',
}: {
  text?: string
  iconName?: React.ComponentProps<typeof Ionicons>['name']
}) => (
  <CenterView flex={1}>
    <Ionicons name={iconName} size={42} />
    <Spacer size="large" />
    <Text>{text}</Text>
  </CenterView>
)

export default EmptyListComponent
