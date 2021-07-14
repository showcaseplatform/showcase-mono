import React from 'react'
import { Alert, View } from 'react-native'

import { translate } from '../../utils/translator'
import { Text } from '../../components/Text.component'
import { useMyModal } from '../../utils/useMyModal'
import { Spacer } from '../../components/Spacer.component'
import { Button } from 'react-native-paper'
import { useTheme } from 'styled-components/native'
import { delay } from '../../utils/helpers'
import { CenterView } from '../../components/CenterView.component'

const StorePasswordReminder = () => {
  const { flowData, handleModal } = useMyModal()
  const theme = useTheme()

  const onSubmit = () => {
    // get latest price of the item
    // on confirm send the pruchasing request

    //// !: text is missing from translator

    Alert.alert(
      'Please confirm the price?',
      `Would you like to buy badgeItem.id: ${flowData.itemId} for palceholder price?`,
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
