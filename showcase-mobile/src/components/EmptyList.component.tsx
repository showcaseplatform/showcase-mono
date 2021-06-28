import React from 'react'
import { CenterView } from './CenterView.component'
import { Text } from './Text.component'

const EmptyListComponent = ({
  text = 'no badges found :(',
}: {
  text: string
}) => (
  <CenterView flex={1}>
    <Text>{text}</Text>
  </CenterView>
)

export default EmptyListComponent
