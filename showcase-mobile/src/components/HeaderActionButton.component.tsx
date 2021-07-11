import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'

type ActionButtonProps = {
  title: string
  onPress: () => void
  disabled?: boolean
}

const HeaderActionButton: React.FC<ActionButtonProps> = ({
  title,
  disabled = false,
  onPress,
}) => {
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text
        style={{
          color: disabled ? theme.colors.text.grey : theme.colors.text.accent,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default HeaderActionButton
