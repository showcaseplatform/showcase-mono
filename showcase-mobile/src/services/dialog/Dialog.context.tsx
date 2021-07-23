import React, { ReactNode, useEffect, useState } from 'react'
import { Dialog, Portal } from 'react-native-paper'
import { DialogContext } from '../../utils/useMyDialog'

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsOpen] = useState(false)
  const [dialogContent, setModalContent] = useState<
    React.ReactNode | undefined
  >(undefined)

  useEffect(() => {
    if (dialogContent) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [dialogContent])

  const closeDialog = () => {
    setModalContent(undefined)
    setIsOpen(false)
  }

  const openDialog = (content: React.ReactNode) => {
    setModalContent(content)
  }

  return (
    <DialogContext.Provider
      value={{
        isDialogOpen,
        closeDialog,
        openDialog,
      }}
    >
      <>
        {children}
        <Portal>
          <Dialog visible={isDialogOpen} onDismiss={closeDialog}>
            {dialogContent}
          </Dialog>
        </Portal>
      </>
    </DialogContext.Provider>
  )
}

export default DialogProvider
