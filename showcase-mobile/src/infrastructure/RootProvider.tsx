import React, { PropsWithChildren } from 'react'
import { ApolloProvider } from '@apollo/client'
import { Portal } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'

import BottomSheetProvider from '../services/bottomSheet/BottomSheetModal.context'
import { TokenProvider } from '../services/persistence/token'
import client from '../services/api/apolloClient'
import theme from './theme'

const RootProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ThemeProvider theme={theme}>
      <TokenProvider>
        <ApolloProvider client={client}>
          <Portal.Host>
            <BottomSheetProvider>{children}</BottomSheetProvider>
          </Portal.Host>
        </ApolloProvider>
      </TokenProvider>
    </ThemeProvider>
  )
}

export default RootProvider
