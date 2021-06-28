import { BottomSheetProps } from '@gorhom/bottom-sheet'
import { createContext, useContext } from 'react'

export interface BottomSheetContextValue {
  expand: (options: BottomSheetProps) => void
  collapse: () => void
}

export const BottomSheetContext = createContext<
  BottomSheetContextValue | undefined
>(undefined)

export const useMyBottomSheet = () => {
  const context = useContext(BottomSheetContext)
  if (context === undefined) {
    throw new Error('useMyBottomSheet must be used within a BottomSheetContext')
  }
  return context
}
