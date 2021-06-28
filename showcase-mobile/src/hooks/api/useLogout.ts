import { useSetToken } from '../../services/persistence/token'

export default function useLogout() {
  const setToken = useSetToken()

  // do some logout thingies which is not yet defined

  return function onLogout() {
    setToken(undefined)
  }
}
