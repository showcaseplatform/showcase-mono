import React, { ReactNode, useState, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Alert, AlertButton } from 'react-native'

import { ModalContext } from '../../utils/useMyModal'
import { translate } from '../../utils/translator'
import { ModalType } from '../../../types/enum'
import { makePriceTag } from '../../utils/helpers'
import {
  BuyBadgeCheckDocument,
  MeDocument,
  useAmIAllowedToBuyQuery,
  useBuyBadgeItemMutation,
} from '../../generated/graphql'

import AddPaymentCardForm from '../../features/payment/AddPaymentCardForm.component'
import CreatePasswordForm from '../../features/payment/CreatePasswordForm.component'
import StorePasswordReminder from '../../features/payment/StorePasswordReminder.component'
import StyledModal from '../../components/StyledModal.component'
import ModalHeader from '../../components/ModalHeader.component'
import { Spacer } from '../../components/Spacer.component'
import { useMyBottomSheet } from '../../utils/useMyBottomSheet'
import AuthenticationFlow from '../../features/authentication/components/AuthenticationFlow.component'

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

const alerts = {
  outOfStock: {
    title: 'Out of Stock',
    message: 'Please try again later',
    cancelable: true,
    buttons: [
      {
        text: 'Ok',
        style: 'cancel',
      },
    ],
  },
  confirmBuy: {
    title: 'Are you sure want to buy?',
    cancelable: true,
  },
}

// TODO: remove business logic, make me a plain modal provider
const BuyBadgeProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentModalType, setCurrentModalType] = useState<ModalType>(
    ModalType.ADD_PAYMENT
  )
  const [badgeTypeId, setBadgeTypeId] = useState<string | undefined>(undefined)

  const { data: dataAllowedToBuy, error: errorAllowedToBuy } =
    useAmIAllowedToBuyQuery()
  const [getBadgeData, { data: dataBadge, error: errorBadge }] = useLazyQuery(
    BuyBadgeCheckDocument
  )
  const { expand } = useMyBottomSheet()

  const [buyBadge] = useBuyBadgeItemMutation({
    onCompleted: () => {
      // todo: success event
      console.log('badge bought, id: ', badgeTypeId)
      setBadgeTypeId(undefined)
    },
    refetchQueries: [{ query: MeDocument }],
  })

  const handleModal = useCallback((modalType?: ModalType) => {
    if (modalType) {
      setCurrentModalType(modalType)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [])

  const outOfStockAlert = () =>
    Alert.alert(
      alerts.outOfStock.title,
      alerts.outOfStock.message,
      alerts.outOfStock.buttons as AlertButton[],
      { cancelable: alerts.outOfStock.cancelable }
    )

  const confirmBuyAlert = (itemId: string) =>
    Alert.alert(
      alerts.confirmBuy.title,
      `title: ${dataBadge?.badgeType?.title} for ${makePriceTag(
        dataBadge?.badgeType?.price,
        dataBadge?.badgeType?.currency
      )}`,
      [
        {
          text: "Why ya' askin?! Sure",
          onPress: () => buyBadge({ variables: { badgeTypeId: itemId } }),
        },
        {
          text: 'No, thanks!',
          style: 'cancel',
          onPress: () => setBadgeTypeId(undefined),
        },
      ] as AlertButton[],
      { cancelable: alerts.confirmBuy.cancelable }
    )

  const buyBadgeItem = async (itemId: string) => {
    if (itemId !== badgeTypeId) {
      setBadgeTypeId(itemId)
    }

    try {
      // todo: manage errors lil'bit more sophisitcated
      if (
        errorAllowedToBuy?.message ===
        "Access denied! You don't have permission for this action!"
      ) {
        return expand({
          children: <AuthenticationFlow />,
          snapPoints: [0, '60%', '80%'],
        })
      }

      if (!dataAllowedToBuy?.me.isAllowedToBuy) {
        return handleModal(ModalType.ADD_PAYMENT)
      }

      getBadgeData({ variables: { id: itemId } }) //todo: promisify me
      // then continue if got supply data
      if (dataBadge?.badgeType?.isSoldOut) {
        return outOfStockAlert()
      }

      return confirmBuyAlert(itemId)
    } catch (error) {
      handleModal()
      console.error('def', error)
      console.error('def', errorAllowedToBuy)
      console.error('def', errorBadge)
    }
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        currentModalType,
        badgeTypeId,
        handleModal,
        buyBadgeItem,
      }}
    >
      <>
        {children}

        <StyledModal
          visible={isOpen}
          onDismiss={handleModal}
          children={
            <>
              <ModalHeader
                title={modals[currentModalType]?.title}
                subtitle={modals[currentModalType]?.subtitle}
                onClose={() => handleModal(undefined)}
              />
              <Spacer size="large" />
              {modals[currentModalType]?.component}
            </>
          }
        />
      </>
    </ModalContext.Provider>
  )
}

export default BuyBadgeProvider
