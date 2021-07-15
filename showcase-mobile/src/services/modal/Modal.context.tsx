import React, { ReactNode, useState, useCallback } from 'react'

import { ModalContext } from '../../utils/useMyModal'
import StyledModal from '../../components/StyledModal.component'
import ModalHeader from '../../components/ModalHeader.component'
import { translate } from '../../utils/translator'
import AddPaymentCardForm from '../../features/payment/AddPaymentCardForm.component'
import { Spacer } from '../../components/Spacer.component'
import CreatePasswordForm from '../../features/payment/CreatePasswordForm.component'
import { ModalType } from '../../../types/enum'
import StorePasswordReminder from '../../features/payment/StorePasswordReminder.component'

const modals = {
  addPayment: {
    title: translate().addCardHeader,
    subtitle: translate().addCardSubHeader,
    component: <AddPaymentCardForm />,
  },
  createPassword: {
    title: translate().createWalletHeader,
    subtitle: translate().createWalletSubHeader,
    component: <CreatePasswordForm />,
  },
  storePassword: {
    title: translate().createWalletHeader,
    subtitle: translate().backupWalletSubHeader,
    component: <StorePasswordReminder />,
  },
}

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentModalType, setContent] = useState<ModalType>(
    ModalType.ADD_PAYMENT
  )

  const handleModal = useCallback((modalType?: ModalType) => {
    if (modalType) {
      setContent(modalType)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [])

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        currentModalType,
        handleModal,
      }}
    >
      <>
        {children}
        <StyledModal
          visible={isOpen}
          onDismiss={() => handleModal()}
          children={
            <>
              <ModalHeader
                title={modals[currentModalType].title}
                subtitle={modals[currentModalType]?.subtitle}
                onClose={() => handleModal()}
              />
              <Spacer size="large" />
              {modals[currentModalType].component}
            </>
          }
        />
      </>
    </ModalContext.Provider>
  )
}

export default ModalProvider
