import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../../components/Text.component'
import { makePercent } from '../../../utils/helpers'

type DonationWidgetProps = {
  openModal: () => void
  donation: number
  image: string
}

const DonationInfoButton = styled(TouchableOpacity)`
  position: absolute;
  top: 13%;
  right: 10px;
  width: 25%;
  align-items: flex-end;
  justify-content: center;
`
const DonationNumberWrapper = styled.View<{ donation: number }>`
  position: absolute;
  left: ${(props) => `${props.donation > 9 ? 0 : 5}px`};
  padding: 8px;
  background-color: ${(props) => props.theme.colors.ui.success};
  width: 80%;
  border-radius: 30px;
`

const DonationMiniImage = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 30px;
`

const DonationWidget = ({
  openModal,
  donation,
  image,
}: DonationWidgetProps) => {
  const donationPercent = useMemo(() => makePercent(donation), [donation])
  return (
    <DonationInfoButton onPress={openModal}>
      <DonationNumberWrapper donation={donationPercent}>
        <Text color="secondary">{donationPercent}%</Text>
      </DonationNumberWrapper>
      <DonationMiniImage source={{ uri: image }} resizeMode="contain" />
    </DonationInfoButton>
  )
}

export { DonationWidget }
