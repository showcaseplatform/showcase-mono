import createStorageHooks from '../../hooks/createStorageHooks'

import createStore from './asyncStorage'

const tokenStore = createStore<string>('authToken')

const tokenStoreHooks = createStorageHooks(tokenStore)

export const TokenProvider = tokenStoreHooks.Provider
export const useSetToken = tokenStoreHooks.useSetData
export const useToken = tokenStoreHooks.useData
export default {
  get: tokenStore.get,
  remove: tokenStore.remove,
}
