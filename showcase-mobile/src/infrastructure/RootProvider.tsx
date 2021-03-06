import React, { PropsWithChildren } from 'react'
import { ApolloProvider } from '@apollo/client'
import { Portal } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'

import BottomSheetProvider from '../services/bottomSheet/BottomSheetModal.context'
import { TokenProvider } from '../services/persistence/token'
import client from '../services/api/apolloClient'
import theme from './theme'
import ModalProvider from '../services/modal/Modal.context'
import DialogProvider from '../services/dialog/Dialog.context'

const RootProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ThemeProvider theme={theme}>
      <TokenProvider>
        <ApolloProvider client={client}>
          <BottomSheetProvider>
            <ModalProvider>
              <Portal.Host>
                <DialogProvider>{children}</DialogProvider>
              </Portal.Host>
            </ModalProvider>
          </BottomSheetProvider>
        </ApolloProvider>
      </TokenProvider>
    </ThemeProvider>
  )
}

export default RootProvider
