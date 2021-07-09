import { Ionicons } from '@expo/vector-icons'
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

import { validateAuthCode } from '../../../utils/authentication.utils'
import { translate } from '../../../utils/translator'
import { useCountdown } from '../../../utils/useCountdown'
import { useMyBottomSheet } from '../../../utils/useMyBottomSheet'
import useLoginWithCode from '../../../hooks/api/useLoginWithCode'
import { SendPhoneCodeInput as PhoneInputProps } from '../../../generated/graphql'

import BottomSheetHeader from '../components/BottomSheetHeader.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import MyTextField from '../../../components/MyTextField.component'
import { Text } from '../../../components/Text.component'
import { CenterView } from '../../../components/CenterView.component'
import { Spacer } from '../../../components/Spacer.component'
import { BottomSheetWrapper } from '../../../components/ScreenWrapper.component'
import { InlineSubmitButton } from '../components/InlineSubmitButton.component'

type SendAuthCodeProps = {
  onBack: () => void
  phoneNumber: PhoneInputProps
}

const SendAuthCode = ({
  onBack,
  phoneNumber: { phone, areaCode },
}: SendAuthCodeProps) => {
  const { sendAuthCode, loading, error } = useLoginWithCode()
  const { counter, pauseCountdown } = useCountdown(onBack, 60)

  const [authCode, setAuthCode] = useState<string>('')
  const [isValid, setIsValidAuthCode] = useState(false)

  const { collapse } = useMyBottomSheet()

  useEffect(() => {
    validateAuthCode(authCode)
      ? setIsValidAuthCode(true)
      : setIsValidAuthCode(false)
  }, [authCode])

  const handleSubmit = () => {
    pauseCountdown()
    isValid &&
      sendAuthCode({ variables: { areaCode, phone, code: authCode } }).then(
        (r) => {
          if (!r.error && r.data) {
            collapse()
          }
        }
      )
  }

  return (
    <BottomSheetWrapper>
      <BottomSheetHeader
        title="authenticationModalCodeHeader"
        subtitle="authenticationModalCodeSubHeader"
        onBack={onBack}
      />

      <Text center bold color="grey">
        {`+${areaCode} ${phone}`}
      </Text>

      <Spacer size="medium" />

      <CenterView row>
        <View style={{ width: '25%', alignItems: 'flex-end' }}>
          <Text color="grey">{counter}s</Text>
        </View>
        <Spacer position="right" size="medium" />
        <View style={{ minWidth: 150 }}>
          <MyTextField
            value={authCode?.toString()}
            underlineColorAndroid="transparent"
            style={{ textAlign: 'center' }}
            placeholder={translate().codePlaceholder}
            spellCheck={false}
            autoCompleteType="off"
            autoFocus={true}
            editable={!loading}
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setAuthCode}
          />
        </View>

        <Spacer position="left" size="medium" />

        <View style={{ width: '25%', alignItems: 'flex-start' }}>
          {loading ? (
            <LoadingIndicator size={40} />
          ) : (
            <InlineSubmitButton
              disabled={!isValid}
              isValid={isValid}
              onPress={handleSubmit}
            >
              <Ionicons name="arrow-forward-outline" size={36} color="white" />
            </InlineSubmitButton>
          )}
        </View>
      </CenterView>

      {error && (
        <Spacer>
          <Text color="error" variant="caption" center>
            {translate().checkingSMSError}
          </Text>
        </Spacer>
      )}
    </BottomSheetWrapper>
  )
}

export default SendAuthCode
