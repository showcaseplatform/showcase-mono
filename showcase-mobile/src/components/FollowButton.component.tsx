import React from 'react'
import { ButtonProps } from 'react-native'
import { Button } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

const FollowButton = ({
  disabled,
  isFollowed,
  onPress,
}: Omit<ButtonProps, 'title' | 'onPress'> & {
  isFollowed: boolean
  onPress: () => void
}) => {
  const theme = useTheme()
  return (
    <Button
      mode="contained"
      color={theme.colors.ui.accent}
      onPress={onPress}
      style={{ borderRadius: 30 }}
      contentStyle={{ width: 140 }}
      uppercase={false}
      disabled={disabled}
    >
      {isFollowed ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

export default FollowButton
