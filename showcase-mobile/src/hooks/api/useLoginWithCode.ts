// this hook can be used as SignUp / SignIn method,
// after a successful phone number to auth code exchange (useSendPhoneNumber)

import { useEffect } from 'react'
import { useSendAuthCodeMutation } from '../../generated/graphql'
import { useSetToken } from '../../services/persistence/token'

export default function useLoginWithCode() {
  const setToken = useSetToken()
  const [sendAuthCode, { data, loading, error }] = useSendAuthCodeMutation()

  useEffect(() => {
    const token = data?.verifyPhoneCode.token
    if (token) {
      setToken(token)
    } else {
      setToken(undefined)
    }
  }, [data, setToken])

  return { sendAuthCode, error, loading }
}
