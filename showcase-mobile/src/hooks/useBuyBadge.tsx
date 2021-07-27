import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Dialog } from 'react-native-paper'
import { useTheme } from 'styled-components/native'
import { ModalType } from '../../types/enum'
import { MyModal } from '../components/MyModal.component'
import { Text } from '../components/Text.component'
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
import { translate } from '../utils/translator'
import { useMyBottomSheet } from '../utils/useMyBottomSheet'
import { useMyDialog } from '../utils/useMyDialog'
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
  const { openDialog, closeDialog } = useMyDialog()

  const theme = useTheme()

  const { data: dataAllowedToBuy, error: errorAllowedToBuy } =
    useAmIAllowedToBuyQuery()

  const { data: dataBadge } = useBuyBadgeCheckQuery({
    variables: { id: badgeTypeId },
  })

  const [buyBadge] = useBuyBadgeItemMutation({
    onCompleted: () => {
      closeDialog()
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
      dataBadge.badgeType?.availableToBuyCount === 0
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
        return openDialog(
          <>
            <Dialog.Title>{translate().outOfStock}</Dialog.Title>
            <Dialog.Content>
              <Text>{translate().tryAgainLater}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={closeDialog}
                mode="contained"
                color={theme.colors.ui.accent}
                style={{ borderRadius: 30 }}
                contentStyle={{ paddingHorizontal: 8 }}
                uppercase
              >
                OK
              </Button>
            </Dialog.Actions>
          </>
        )
      }
      case BuyStep.SUCCESS: {
        break
      }
      default: {
        return openDialog(
          <>
            <Dialog.Title>{translate().confirmBuyBadgeTitle}</Dialog.Title>
            <Dialog.Content>
              <Text>
                {dataBadge?.badgeType?.title} for{' '}
                {makePriceTag(
                  dataBadge?.badgeType?.price,
                  dataBadge?.badgeType?.currency
                )}{' '}
                ?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={closeDialog}
                color={theme.colors.ui.accent}
                contentStyle={{ paddingHorizontal: 8 }}
                uppercase
              >
                cancel
              </Button>
              <Button
                onPress={() => buyBadge({ variables: { badgeTypeId } })}
                mode="contained"
                color={theme.colors.ui.accent}
                style={{ borderRadius: 20 }}
                contentStyle={{ paddingHorizontal: 8 }}
                uppercase
              >
                buy
              </Button>
            </Dialog.Actions>
          </>
        )
      }
    }
  }

  return { buyItem }
}

export default useBuyBadge
