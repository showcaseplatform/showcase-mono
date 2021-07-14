import React, { ReactNode, useState, useCallback } from 'react'

import { FlowData, ModalContext } from '../../utils/useMyModal'
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

const defaultFlowData: FlowData = {
  password: undefined,
  itemId: undefined,
}

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentModalType, setContent] = useState<ModalType>(
    ModalType.ADD_PAYMENT
  )
  const [flowData, setFlowData] = useState(defaultFlowData)

  const handleFlowData = (key: keyof FlowData, data: Partial<FlowData>) => {
    setFlowData((prevState) => ({
      ...prevState,
      [key]: data[key],
    }))
  }

  const handleModal = useCallback(
    (modalType?: ModalType, initVals?: Partial<FlowData>) => {
      if (modalType) {
        setContent(modalType)
        setFlowData((prevState) => ({
          ...prevState,
          ...initVals,
        }))
        setIsOpen(true)
      } else {
        setIsOpen((currState) => !currState)
      }
    },
    []
  )

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        currentModalType,
        handleModal,
        flowData,
        handleFlowData,
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
