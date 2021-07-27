import React from 'react'
import { ModalType } from '../../types/enum'
import { translate } from '../utils/translator'
import ModalHeader from './ModalHeader.component'
import { Spacer } from './Spacer.component'

const modals = {
  addPayment: {
    title: translate().addCardHeader,
    subtitle: translate().addCardSubHeader,
  },
  createPassword: {
    title: translate().createWalletHeader,
    subtitle: translate().createWalletSubHeader,
  },
  storePassword: {
    title: translate().createWalletHeader,
    subtitle: translate().backupWalletSubHeader,
  },
}

export const MyModal = ({
  modalType,
  children,
  onClose,
}: {
  modalType: ModalType
  children: React.ReactNode
  onClose: () => void
}) => (
  <>
    <ModalHeader
      title={modals[modalType]?.title}
      subtitle={modals[modalType]?.subtitle}
      onClose={onClose}
    />
    <Spacer size="large" />
    {children}
  </>
)
