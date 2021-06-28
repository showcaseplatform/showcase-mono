import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components/Text.component'

export const BadgeHistorySectionHeader = ({ title }: { title: string }) => (
  <View style={{ elevation: 1, padding: 10, backgroundColor: 'white' }}>
    <Text variant="heading" color="grey">
      {title}
    </Text>
  </View>
)
