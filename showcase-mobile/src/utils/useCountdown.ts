import { useState, useRef, useCallback, useEffect } from 'react'

export const useCountdown = (callbackOnEnd: () => void, initCounter = 60) => {
  const [counter, setCounter] = useState<number>(initCounter)
  const isPaused = useRef(false)

  const handleCountdown = useCallback(() => {
    if (isPaused.current) return
    setCounter((prevCounter) => (prevCounter > 0 ? --prevCounter : 0))
  }, [isPaused])

  useEffect(() => {
    const countDown = setInterval(handleCountdown, 1000)
    return () => clearInterval(countDown)
  }, [handleCountdown])

  useEffect(() => {
    if (counter === 0) {
      callbackOnEnd()
    }
  }, [callbackOnEnd, counter])

  const pauseCountdown = () => (isPaused.current = true)

  return { counter, pauseCountdown }
}
