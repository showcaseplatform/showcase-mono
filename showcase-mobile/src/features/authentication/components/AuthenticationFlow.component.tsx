import React, { useState } from 'react'
import { SendPhoneCodeInput as PhoneInputProps } from '../../../generated/graphql'
import SendAuthCode from '../screens/SendAuthCode.sceen'
import SendPhoneNumber from '../screens/SendPhoneNumber.screen'

export enum AuthStep {
  ENTER_PHONE = 'enterPhone',
  ENTER_AUTHCODE = 'enterAuthCode',
}

const AuthenticationFlow = () => {
  const [currentAuthStep, setCurrentAuthStep] = useState<AuthStep>(
    AuthStep.ENTER_AUTHCODE
  )
  const [phoneNumber, setPhone] = useState<PhoneInputProps>({
    areaCode: '36',
    phone: '704423015',
  })

  switch (currentAuthStep) {
    default:
      return (
        <SendPhoneNumber
          phoneNumber={phoneNumber}
          onValueChange={setPhone}
          onNext={() => setCurrentAuthStep(AuthStep.ENTER_AUTHCODE)}
        />
      )
    case AuthStep.ENTER_AUTHCODE:
      return (
        <SendAuthCode
          phoneNumber={phoneNumber}
          onBack={() => setCurrentAuthStep(AuthStep.ENTER_PHONE)}
        />
      )
  }
}

export default AuthenticationFlow
