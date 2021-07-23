import React, { ReactNode, useEffect, useState } from 'react'

import { ModalContext } from '../../utils/useMyModal'

import StyledModal from '../../components/StyledModal.component'

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode | undefined>(
    undefined
  )

  useEffect(() => {
    if (modalContent) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [modalContent])

  const closeModal = () => {
    setModalContent(undefined)
    setIsOpen(false)
  }

  const openModal = (content: React.ReactNode) => {
    setModalContent(content)
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        closeModal,
        openModal,
      }}
    >
      <>
        {children}
        <StyledModal
          visible={isOpen}
          onDismiss={closeModal}
          children={modalContent}
        />
      </>
    </ModalContext.Provider>
  )
}

export default ModalProvider
