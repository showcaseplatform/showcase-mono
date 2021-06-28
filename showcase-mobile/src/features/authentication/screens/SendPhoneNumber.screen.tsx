import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { View, TextInput } from 'react-native'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons'

import {
  areaCodes,
  validateMobilePhone,
} from '../../../utils/authentication.utils'
import { translate } from '../../../utils/translator'

import BottomSheetHeader from '../components/BottomSheetHeader.component'
import Privacy from '../components/Privacy.component'
import Terms from '../components/Terms.component'
import MyTextField from '../../../components/MyTextField.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import { Spacer } from '../../../components/Spacer.component'
import { BottomSheetWrapper } from '../../../components/ScreenWrapper.component'
import MySelectInputComponent from '../../../components/MySelectInput.component'
import { CenterView } from '../../../components/CenterView.component'
import { InlineSubmitButton } from '../components/InlineSubmitButton.component'
import { Text } from '../../../components/Text.component'
import {
  SendPhoneCodeInput as PhoneInputProps,
  SendPhoneCodeInput,
  useSendPhoneNumberMutation,
} from '../../../generated/graphql'
import { TouchableOpacity } from '@gorhom/bottom-sheet'

enum SubmodalType {
  privacy = 'privacy',
  terms = 'terms',
}

type SendPhoneNumberProps = {
  phoneNumber: PhoneInputProps
  onValueChange: Dispatch<SetStateAction<SendPhoneCodeInput>>
  onNext: () => void
}

const TermsWrapper = styled(View)`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const SendPhoneNumber = ({
  phoneNumber: { areaCode, phone },
  onValueChange,
  onNext,
}: SendPhoneNumberProps) => {
  const [{ fetching, error }, sendPhoneNumber] = useSendPhoneNumberMutation()
  const [showSubmodalType, setShowSubmodalType] = useState<
    SubmodalType | undefined
  >(undefined)
  const [isValidPhone, setIsValidPhone] = useState(false)
  const phoneInputRef = useRef(null) as MutableRefObject<TextInput | null>

  useEffect(() => {
    validateMobilePhone(parseInt(areaCode, 10), parseInt(phone, 10))
      ? setIsValidPhone(true)
      : setIsValidPhone(false)
  }, [phone, areaCode])

  function handleCloseSubmodal() {
    setShowSubmodalType(undefined)
  }

  function handlePhoneInputChange(key: string, value: string) {
    onValueChange((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleSubmit = () => {
    isValidPhone &&
      sendPhoneNumber({ areaCode, phone }).then((r) => {
        if (!r.error && r.data) {
          onNext()
        }
      })
  }

  if (showSubmodalType) {
    switch (showSubmodalType) {
      case SubmodalType.privacy:
        return <Privacy onBack={handleCloseSubmodal} />
      case SubmodalType.terms:
        return <Terms onBack={handleCloseSubmodal} />
    }
  }

  return (
    <BottomSheetWrapper>
      <BottomSheetHeader
        title="authenticationModalHeader"
        subtitle="authenticationModalSubHeader"
      />
      <CenterView row>
        <View style={{ width: '30%' }}>
          <MySelectInputComponent
            value={areaCode}
            items={areaCodes}
            onValueChange={(val) =>
              handlePhoneInputChange('areaCode', val.toString())
            }
            onBlur={() => {
              phoneInputRef.current?.focus()
            }}
            placeholder="your area code"
            numberSelect
          />
        </View>

        <Spacer size="medium" position="right" />

        <View style={{ width: '40%' }}>
          <MyTextField
            underlineColorAndroid="transparent"
            placeholder={translate().phonePlaceholder}
            spellCheck={false}
            autoCompleteType="off"
            autoFocus={true}
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={(val) => {
              handlePhoneInputChange('phone', val)
            }}
            editable={!fetching}
          />
        </View>

        <Spacer position="left" size="medium" />

        <View>
          {fetching ? (
            <LoadingIndicator size={40} />
          ) : (
            <InlineSubmitButton
              disabled={!isValidPhone}
              onPress={handleSubmit}
              isValid={isValidPhone}
            >
              <Ionicons name="arrow-forward-outline" size={36} color="white" />
            </InlineSubmitButton>
          )}
        </View>
      </CenterView>
      <Spacer size="medium" />
      {error && (
        <Spacer>
          <Text color="error" variant="caption" center>
            {/* {error} */}
            {translate().sendingSMSError}
          </Text>
        </Spacer>
      )}
      <TermsWrapper>
        <>
          <Text color="grey" variant="caption">
            {translate().authenticationModalTermsDisclaimer}
          </Text>
          <TouchableOpacity
            onPress={() => setShowSubmodalType(SubmodalType.terms)}
          >
            <Text color="accent" variant="caption">
              {translate().authenticationModalTermsLink}
            </Text>
          </TouchableOpacity>
        </>
        <>
          <Text color="grey" variant="caption">
            {translate().authenticationModalPrivacyDisclaimer}
          </Text>
          <TouchableOpacity
            onPress={() => setShowSubmodalType(SubmodalType.privacy)}
          >
            <Text color="accent" variant="caption">
              {translate().authenticationModalPrivacyLink}
            </Text>
          </TouchableOpacity>
        </>
        <Text color="grey" variant="caption" center>
          {translate().authenticationModalSMSDisclaimer}
        </Text>
      </TermsWrapper>
    </BottomSheetWrapper>
  )
}

export default SendPhoneNumber
