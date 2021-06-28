import React from 'react'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Text } from '../../../components/Text.component'

type ModalHeaderProps = {
  title: string
  onClose: () => void
}

const ModalHeader = ({ title = 'placeholder', onClose }: ModalHeaderProps) => {
  return (
    <View flexDirection="row" alignItems="center">
      <IconButton icon="close" onPress={onClose} />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          alignItems: 'center',
          zIndex: -1,
        }}
      >
        <Text variant="heading">{title}</Text>
      </View>
    </View>
  )
}

export default ModalHeader
