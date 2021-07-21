import React, { createContext, useContext } from 'react'

export type ModalContextValue = {
  isOpen: boolean
  closeModal: () => void
  openModal: (content: React.ReactNode) => void
}

// !: delete me
export type FlowData = {
  password?: string
  itemId?: string // BadgeItem id
}

export const ModalContext = createContext<ModalContextValue | undefined>(
  undefined
)

export const useMyModal = () => {
  const ctx = useContext(ModalContext)
  if (ctx === undefined) {
    throw new Error('useMyModal must be used within ModalProvider')
  }
  return ctx
}
