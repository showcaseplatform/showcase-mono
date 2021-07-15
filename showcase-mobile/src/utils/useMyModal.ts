import { createContext, useContext } from 'react'
import { ModalType } from '../../types/enum'

export type ModalContextValue = {
  isOpen: boolean
  currentModalType: ModalType
  handleModal: (modalType?: ModalType) => void
}

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