import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { Store } from '../services/persistence/asyncStorage'

import useSafeCall from './useSafeCall'
import useSafeContext from './useSafeContext'

type SetDataInput<T> = T | null | undefined

export default function createStorageHooks<T>(store: Store<T>) {
  const StorageContext = createContext<T | null | undefined>(undefined)
  const SetStorageContext = createContext<
    ((input: SetDataInput<T>) => Promise<void>) | undefined
  >(undefined)

  function useMyAsyncStorage(): [
    T | null,
    (input: SetDataInput<T>) => Promise<void>
  ] {
    const safeCall = useSafeCall()
    const [state, setStateInternal] = useState<T | null>(null)

    const setState = useCallback(
      async (input: SetDataInput<T>) => {
        if (input === undefined || input === null) {
          await store.remove()
        } else {
          await store.set(input)
        }
        safeCall(() => setStateInternal(input ?? null))
      },
      [safeCall]
    )

    useEffect(() => {
      store.get().then((r) => safeCall(() => setStateInternal(r)))
    }, [safeCall])

    return [state, setState]
  }

  function Provider({ children }: PropsWithChildren<{}>) {
    const [data, setData] = useMyAsyncStorage()
    return (
      <StorageContext.Provider value={data}>
        <SetStorageContext.Provider value={setData}>
          {children}
        </SetStorageContext.Provider>
      </StorageContext.Provider>
    )
  }
  return {
    Provider,
    useData: () => useSafeContext(StorageContext),
    useSetData: () => useSafeContext(SetStorageContext),
  }
}
