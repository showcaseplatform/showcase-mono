import React from 'react'
import { Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Spacer } from '../../../components/Spacer.component'
import { CenterView } from '../../../components/CenterView.component'

const EmptyListForProfile = () => (
  <CenterView flex={1}>
    <Ionicons name="ios-images-outline" size={42} />
    <Spacer size="large" />
    <Text>No Badges yet.</Text>
  </CenterView>
)

export default EmptyListForProfile
