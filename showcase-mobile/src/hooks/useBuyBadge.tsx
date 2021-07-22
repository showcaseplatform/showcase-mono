// import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Alert, AlertButton } from 'react-native'
import { ModalType } from '../../types/enum'
import { MyModal } from '../components/MyModal.component'
import AuthenticationFlow from '../features/authentication/components/AuthenticationFlow.component'
import AddPaymentCardForm from '../features/payment/AddPaymentCardForm.component'
// import CreatePasswordForm from '../features/payment/CreatePasswordForm.component'
// import StorePasswordReminder from '../features/payment/StorePasswordReminder.component'
import {
  BuyBadgeCheckDocument,
  MeDocument,
  useAmIAllowedToBuyQuery,
  useBuyBadgeCheckQuery,
  useBuyBadgeItemMutation,
} from '../generated/graphql'
import { makePriceTag } from '../utils/helpers'
import { useMyBottomSheet } from '../utils/useMyBottomSheet'
import { useMyModal } from '../utils/useMyModal'

enum BuyStep {
  LOGIN_REQ = 'loginReq',
  PAYMENT_INFO_REQ = 'paymentInfoReq',
  OUT_OF_STOCK = 'outOfStock',
  CONFIRM_BUY = 'confirmBuy',
  SUCCESS = 'success',
}

const useBuyBadge = (badgeTypeId: string) => {
  const [currentBuyStep, setCurrentBuyStep] = useState<BuyStep | undefined>(
    undefined
  )
  const { expand } = useMyBottomSheet()
  const { openModal, closeModal } = useMyModal()

  const { data: dataAllowedToBuy, error: errorAllowedToBuy } =
    useAmIAllowedToBuyQuery()

  const { data: dataBadge } = useBuyBadgeCheckQuery({
    variables: { id: badgeTypeId },
  })

  const [buyBadge] = useBuyBadgeItemMutation({
    onCompleted: () => {
      console.log('badge bought, id: ', badgeTypeId)
    },
    refetchQueries: [
      { query: BuyBadgeCheckDocument, variables: { id: badgeTypeId } },
      { query: MeDocument },
    ],
  })

  // this should set buy flow's state based on user- and badge-info
  useEffect(() => {
    if (!dataAllowedToBuy?.me.isAllowedToBuy) {
      // dont have payment info filled
      if (
        // cuz not logged in ?
        errorAllowedToBuy?.message ===
        "Access denied! You don't have permission for this action!"
      ) {
        setCurrentBuyStep(BuyStep.LOGIN_REQ)
      } else {
        // cuz no payment info provided
        setCurrentBuyStep(BuyStep.PAYMENT_INFO_REQ)
      }
    } else if (
      // current badge is out of stock
      dataBadge &&
      dataBadge.badgeType?.availableToBuyCount &&
      dataBadge.badgeType?.availableToBuyCount < 1
    ) {
      setCurrentBuyStep(BuyStep.OUT_OF_STOCK)
    } else if (badgeTypeId && currentBuyStep !== BuyStep.SUCCESS) {
      setCurrentBuyStep(BuyStep.CONFIRM_BUY)
    } else {
      setCurrentBuyStep(BuyStep.SUCCESS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataAllowedToBuy?.me.isAllowedToBuy,
    dataBadge?.badgeType?.availableToBuyCount,
    errorAllowedToBuy?.message,
  ])

  const buyItem = () => {
    switch (currentBuyStep) {
      case BuyStep.LOGIN_REQ: {
        return expand({
          children: <AuthenticationFlow />,
          snapPoints: [0, '60%', '80%'],
        })
      }
      case BuyStep.PAYMENT_INFO_REQ: {
        return openModal(
          <MyModal modalType={ModalType.ADD_PAYMENT} onClose={closeModal}>
            <AddPaymentCardForm
              onCompleted={() => {
                console.log('do soemthing on add payment success')
                closeModal()
              }}
            />
          </MyModal>
        )
      }
      case BuyStep.OUT_OF_STOCK: {
        return Alert.alert(
          'Out of Stock',
          'Please try again later',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          { cancelable: true }
        )
      }
      case BuyStep.SUCCESS: {
        break
      }
      default: {
        return Alert.alert(
          'Are you sure want to buy?',
          `title: ${dataBadge?.badgeType?.title} for ${makePriceTag(
            dataBadge?.badgeType?.price,
            dataBadge?.badgeType?.currency
          )}`,
          [
            {
              text: "Why ya' askin?! Sure",
              onPress: () => buyBadge({ variables: { badgeTypeId } }),
            },
            {
              text: 'No, thanks!',
              style: 'cancel',
              onPress: () => setCurrentBuyStep(undefined),
            },
          ] as AlertButton[],
          { cancelable: true }
        )
      }
    }
  }

  return { buyItem }
}

export default useBuyBadge
