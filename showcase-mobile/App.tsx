import React from 'react'
import { Platform, UIManager } from 'react-native'
import AppLoading from 'expo-app-loading'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'

import {
  useFonts as useLato,
  Lato_400Regular,
  Lato_700Bold,
} from '@expo-google-fonts/lato'

import NavigationRoot from './src/infrastructure/navigation'
import RootProvider from './src/infrastructure/RootProvider'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function App() {
  const [fontsLoaded] = useLato({
    Lato_400Regular,
    Lato_700Bold,
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <>
      <RootProvider>
        <NavigationRoot />
      </RootProvider>
      <ExpoStatusBar style="auto" />
    </>
  )
}
