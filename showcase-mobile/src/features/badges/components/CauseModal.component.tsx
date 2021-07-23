import React, { useCallback, useMemo } from 'react'
import { View, Image } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'

import { Cause } from '../../../generated/graphql'
import { makePercent } from '../../../utils/helpers'
import { translate } from '../../../utils/translator'

import ModalHeader from '../../../components/ModalHeader.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { CenterView } from '../../../components/CenterView.component'
import StyledModal, {
  StyledModalProps,
} from '../../../components/StyledModal.component'

interface CauseModalProps extends StyledModalProps {
  cause: Pick<Cause, 'name' | 'site' | 'imageUrl'>
  donation: number
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
