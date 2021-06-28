import BottomSheet, {
  BottomSheetProps,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet'
import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  PropsWithChildren,
  useEffect,
} from 'react'
import {
  BottomSheetContext,
  BottomSheetContextValue,
} from '../../utils/useMyBottomSheet'

const BottomSheetProvider = ({ children }: PropsWithChildren<{}>) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [options, setOptions] = useState<BottomSheetProps | null>(null)
  const snapPoints = useMemo(() => options?.snapPoints || [0, '70%'], [options])

  useEffect(() => {
    if (options) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.collapse()
    }
  }, [options])

  const collapseBottomSheet = useCallback(() => setOptions(null), [])

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === 0) {
        collapseBottomSheet()
      }
    },
    [collapseBottomSheet]
  )

  const bottomSheetContextValues: BottomSheetContextValue = useMemo(
    () => ({
      expand: setOptions,
      collapse: collapseBottomSheet,
    }),
    [collapseBottomSheet]
  )

  return (
    <BottomSheetContext.Provider value={bottomSheetContextValues}>
      {children}
      <BottomSheet
        index={-1}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={null}
      >
        {options?.children}
      </BottomSheet>
    </BottomSheetContext.Provider>
  )
}

export default BottomSheetProvider
