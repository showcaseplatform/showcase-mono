import { Ionicons } from '@expo/vector-icons'

import React, { useCallback, useMemo } from 'react'
import { View, Image, Alert } from 'react-native'
import { useTheme } from 'styled-components/native'
import styled from 'styled-components/native'
import { Modal } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'

import { Cause } from '../../../generated/graphql'
import { makePercent } from '../../../utils/helpers'
import { translate } from '../../../utils/translator'

import ModalHeader from '../components/CauseModalHeader.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { CenterView } from '../../../components/CenterView.component'

const StyledModal = styled(Modal).attrs({
  contentContainerStyle: {
    height: '80%',
    width: '84%',
    bottom: '10%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
})`
  align-items: center;
  justify-content: flex-end;
`
interface CauseModalProps {
  isOpen: boolean
  cause: Cause
  donation: number
  closeModal: () => void
}

const CauseModal = ({
  cause,
  isOpen,
  donation,
  closeModal,
}: CauseModalProps) => {
  const { name, site, imageUrl } = cause
  const theme = useTheme()
  const donationText = useMemo(
    () => `${makePercent(donation)}% ${translate().causeInfoText}`,
    [donation]
  )

  const handleOpenWithBrowser = useCallback((url: string) => {
    WebBrowser.openBrowserAsync(url)
  }, [])

  return (
    <StyledModal visible={isOpen} onDismiss={closeModal}>
      <ModalHeader title={translate().causeModalHeader} onClose={closeModal} />
      <CenterView flex={1}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="contain"
          style={{
            width: '60%',
            height: '60%',
          }}
        />
      </CenterView>
      <View flex={1} alignItems="center">
        <Text variant="smallBody">{name}</Text>
        <Spacer size="medium" />
        <Spacer position="all">
          <CenterView row>
            <Text variant="link" onPress={() => handleOpenWithBrowser(site)}>
              {site}
            </Text>
            <Spacer position="left" />
            <Ionicons
              name="ios-link"
              size={18}
              color={theme.colors.text.link}
            />
          </CenterView>
        </Spacer>
        <Spacer size="medium" />
        <Text variant="smallBody" style={{ textAlign: 'center' }}>
          {donationText}
        </Text>
      </View>
    </StyledModal>
  )
}

export default CauseModal
