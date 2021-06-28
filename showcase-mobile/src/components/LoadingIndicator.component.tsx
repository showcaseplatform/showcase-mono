import React from 'react'
import { ActivityIndicator } from 'react-native-paper'
import { useTheme } from 'styled-components'
import { CenterView } from './CenterView.component'

type LoadingIndicatorProps = {
  fullScreen?: boolean
  size?: number
}

const LoadingIndicator = ({
  fullScreen = false,
  size = 50,
}: LoadingIndicatorProps) => {
  const theme = useTheme()
  return (
    <CenterView flex={fullScreen ? 1 : 0}>
      <ActivityIndicator size={size} color={theme.colors.ui.accent} />
    </CenterView>
  )
}

export default LoadingIndicator
