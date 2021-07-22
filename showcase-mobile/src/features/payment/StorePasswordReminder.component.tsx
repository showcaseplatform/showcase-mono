import React from 'react'
import { Alert, View } from 'react-native'

import { translate } from '../../utils/translator'
import { Text } from '../../components/Text.component'
import { useMyModal } from '../../utils/useMyModal'
import { Spacer } from '../../components/Spacer.component'
import { Button } from 'react-native-paper'
import { useTheme } from 'styled-components/native'
import { delay, makePriceTag } from '../../utils/helpers'
import { CenterView } from '../../components/CenterView.component'
import { useBadgeTypeQuery } from '../../generated/graphql'

const StorePasswordReminder = () => {
  const { flowData, handleModal } = useMyModal()
  const theme = useTheme()

  const { data, refetch } = useBadgeTypeQuery({
    variables: {
      id: flowData.itemId || '',
    },
  })

  const onSubmit = async () => {
    // get latest price of the item
    // on confirm send the pruchasing request

    await refetch()

    // !: text is missing from translator
    // !: improve price handling asap backend is ready
    Alert.alert(
      'Please confirm the price?',
      `Would you like to buy badgeItem.id: ${
        flowData.itemId
      } for ${makePriceTag(
        data?.badgeType?.price,
        data?.badgeType?.currency
      )}?`,
      [
        {
          text: "Why ya' askin?! Sure",
          onPress: () => {
            delay(1500)
            handleModal()
          },
        },
        {
          text: 'No Way, Get OFF',
          style: 'cancel',
          onPress: () => handleModal(),
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <View flexGrow={1}>
      <Text center color="grey">
        {translate().backupWalletShowPassword}
      </Text>
      <Spacer position="y" size="medium" />
      <Text center>{flowData.password}</Text>
      <Spacer position="y" size="medium" />
      <Text center>{translate().backupWalletDescription}</Text>
      <Spacer position="y" size="large" />
      <CenterView>
        <Button
          mode="contained"
          color={theme.colors.ui.accent}
          style={{ borderRadius: 30 }}
          onPress={() => onSubmit()}
          // disabled={formState.isSubmitting}
        >
          {translate().continueButton}
        </Button>
      </CenterView>
    </View>
  )
}

export default StorePasswordReminder
