import React, { createContext, useContext } from 'react'

export type DialogContextValues = {
  isDialogOpen: boolean
  closeDialog: () => void
  openDialog: (content: React.ReactNode) => void
}

export const DialogContext = createContext<DialogContextValues | undefined>(
  undefined
)

export const useMyDialog = () => {
  const ctx = useContext(DialogContext)
  if (ctx === undefined) {
    throw new Error('useMyialog must be used within DialogProvider')
  }
  return ctx
}
