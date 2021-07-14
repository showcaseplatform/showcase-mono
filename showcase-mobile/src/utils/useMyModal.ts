import { createContext, useContext } from 'react'
import { ModalType } from '../../types/enum'

export type ModalContextValue = {
  isOpen: boolean
  currentModalType: ModalType
  flowData: FlowData
  handleModal: (modalType?: ModalType, initVals?: Partial<FlowData>) => void
  handleFlowData: (key: keyof FlowData, data: Partial<FlowData>) => void
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
