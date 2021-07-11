import { useCallback, useLayoutEffect, useRef } from 'react'

export default function useSafeCall() {
  const mountRef = useIsMounted()

  return useCallback(
    (fn: () => void) => {
      if (mountRef.current) {
        fn()
      }
    },
    [mountRef]
  )
}

function useIsMounted() {
  const ref = useRef(false)

  useLayoutEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  })

  return ref
}
