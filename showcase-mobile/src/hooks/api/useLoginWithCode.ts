// this hook can be used as SignUp / SignIn method,
// after a successful phone number to auth code exchange (useSendPhoneNumber)

import { useEffect } from 'react'
import { useSendAuthCodeMutation } from '../../generated/graphql'
import { useSetToken } from '../../services/persistence/token'

export default function useLoginWithCode() {
  const setToken = useSetToken()
  const authWithCodeTuple = useSendAuthCodeMutation()
  const [authResult] = authWithCodeTuple

  useEffect(() => {
    const token = authResult.data?.verifyPhoneCode.token
    if (token) {
      setToken(token)
    }
  }, [authResult.data, setToken])

  return authWithCodeTuple
}
