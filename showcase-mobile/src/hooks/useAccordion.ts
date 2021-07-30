import { useRef, useState } from 'react'
import { LayoutAnimation } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

type AccordionStateProps = string | number | undefined

const useAccordion = () => {
  let scrollRef = useRef<ScrollView | null>(null)

  const [currentOpenAccordion, setExpandedAccordion] =
    useState<AccordionStateProps>(undefined)

  const handleOpenAccordion = (accordionId: number | string) => {
    LayoutAnimation.easeInEaseOut()
    if (accordionId === currentOpenAccordion) {
      setExpandedAccordion(undefined)
    } else {
      setExpandedAccordion(accordionId)
    }
  }

  return { currentOpenAccordion, handleOpenAccordion, scrollRef }
}

export default useAccordion
