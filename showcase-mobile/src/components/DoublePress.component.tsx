import React, { useEffect, useRef } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

interface DoublePressProps {
  children: React.ReactNode
  delay: number
  onDoublePress: () => void
}

export const DoublePress = ({
  children,
  delay,
  onDoublePress,
}: DoublePressProps) => {
  const firstPress = useRef<boolean>(true)
  const lastTime = useRef<number>(new Date().getTime())
  const timer = useRef<number | boolean>(false)

  useEffect(() => {
    return () =>
      typeof timer.current === 'number'
        ? clearTimeout(timer.current)
        : undefined
  })

  function handleDoublePress() {
    let now = new Date().getTime()

    if (firstPress.current) {
      firstPress.current = false
      timer.current = setTimeout(() => {
        firstPress.current = true
      }, delay)
      lastTime.current = now
    } else {
      if (now - lastTime.current < delay) {
        typeof timer.current === 'number' && clearTimeout(timer.current)
        onDoublePress()
        firstPress.current = true
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleDoublePress}>
      {children}
    </TouchableWithoutFeedback>
  )
}
