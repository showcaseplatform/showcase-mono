import React, { PropsWithChildren } from 'react'
import { Provider } from 'urql'
import { Portal } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'

import client from '../services/api/client'
import BottomSheetProvider from '../services/bottomSheet/BottomSheetModal.context'
import { TokenProvider } from '../services/persistence/token'
import theme from './theme'

const RootProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ThemeProvider theme={theme}>
      <TokenProvider>
        <Provider value={client}>
          <Portal.Host>
            <BottomSheetProvider>{children}</BottomSheetProvider>
          </Portal.Host>
        </Provider>
      </TokenProvider>
    </ThemeProvider>
  )
}

export default RootProvider
