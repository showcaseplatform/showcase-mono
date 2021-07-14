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
  const [options, setOptions] = useState<BottomSheetProps | undefined>(
    undefined
  )

  useEffect(() => {
    if (options) {
      bottomSheetRef.current?.snapTo(1)
    } else {
      bottomSheetRef.current?.collapse()
    }
  }, [options])

  const collapseBottomSheet = useCallback(() => setOptions(undefined), [])

  const handleSheetChanges = useCallback(
    (index: number) => {
      index > 0 ? bottomSheetRef.current?.snapTo(index) : collapseBottomSheet()
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
        snapPoints={options?.snapPoints || [0, '60%', '80%']}
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
