import { Alert } from 'react-native'
import { ModalType } from '../../types/enum'
import { useMeQuery, useBadgeTypeQuery } from '../generated/graphql'
import { delay, makePriceTag } from './helpers'
import { FlowData, useMyModal } from './useMyModal'

// ?: May ALert should be repalced with Modals?!
const useBuyFlow = (initFlowData: FlowData) => {
  const { data: meData } = useMeQuery({ fetchPolicy: 'network-only' })
  const { data } = useBadgeTypeQuery({
    variables: { id: initFlowData?.itemId || '' },
  })
  const { handleModal } = useMyModal()

  const hasPaymentInfo =
    meData?.me.paymentInfo?.idToken &&
    meData?.me.paymentInfo?.lastFourCardDigit.length === 4

  const hasSupply = data?.badgeType?.supply && data?.badgeType?.supply > 0

  function start(startFlowData?: FlowData) {
    if (!data || !meData) {
      Alert.alert("Can't find badge or user", undefined, [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ])

      // TODO: should check for password / wallet
      // save password or read into flowData
    } else if (!hasPaymentInfo) {
      handleModal(ModalType.ADD_PAYMENT)
    } else if (!hasSupply) {
      Alert.alert('Sorry out of stock, please try again later', undefined, [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ])
    } else {
      Alert.alert(
        'Are you sure want to buy?',
        `id: ${startFlowData?.itemId} for ${makePriceTag(
          data.badgeType?.price,
          data.badgeType?.currency
        )}`,
        [
          {
            text: "Why ya' askin?! Sure",
            onPress: () => {
              // do the purchase
              delay(1500)
            },
          },
          {
            text: 'No Way, Get OFF',
            style: 'cancel',
            onPress: () => {
              // do the purchase
            },
          },
        ]
      )
    }
  }

  // todo: make sure Me to be laoded

  return { start }
}

export default useBuyFlow
