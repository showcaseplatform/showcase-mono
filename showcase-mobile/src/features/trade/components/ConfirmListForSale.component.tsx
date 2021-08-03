import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, Dialog, Text } from 'react-native-paper'

import {
  ListBadgeForSaleInput,
  Currency,
  MeDocument,
  useListBadgeItemForSaleMutation,
} from '../../../generated/graphql'
import theme from '../../../infrastructure/theme'
import { currencies } from '../../../utils/currencies'
import { translate } from '../../../utils/translator'

import MySelectInputComponent from '../../../components/MySelectInput.component'
import MyTextFieldComponent from '../../../components/MyTextField.component'
import { Spacer } from '../../../components/Spacer.component'

const ConfirmListForSale = ({
  badgeItemId,
  onClose,
}: {
  badgeItemId: string
  onClose: () => void
}) => {
  const { handleSubmit, control } = useForm<ListBadgeForSaleInput>({
    defaultValues: {
      sig: 'fakefakefake',
      message: '',
      currency: Currency.Usd,
      price: 0,
    },
  })

  const [listForSale, { loading }] = useListBadgeItemForSaleMutation({
    refetchQueries: [{ query: MeDocument }],
    onCompleted: () => onClose(),
  })

  const onSubmit = handleSubmit((data) => {
    listForSale({
      variables: { data: { ...data, badgeItemId } },
    })
  })

  return (
    <>
      <Dialog.Title>{translate().listForSaleDialogTitle}</Dialog.Title>
      <Dialog.Content>
        <Text>{badgeItemId} for</Text>
        <Spacer position="bottom" size="large" />
        <View flexDirection="row">
          <View style={{ width: '25%' }}>
            <Controller
              name="price"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <MyTextFieldComponent
                  onBlur={onBlur}
                  onChangeText={(val) => val && onChange(parseInt(val, 10))}
                  value={value?.toString()}
                  error={error}
                  placeholder="Price"
                  keyboardType="number-pad"
                  // editable={!getValues('isFree')}
                />
              )}
            />
          </View>
          <Spacer position="left" size="large" />
          <View style={{ width: '30%' }}>
            <Controller
              name="currency"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MySelectInputComponent
                  placeholder={translate().balanceCurrencyLabel}
                  items={currencies}
                  value={value}
                  onValueChange={(val) => onChange(val)}
                />
              )}
            />
          </View>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={onClose}
          color={theme.colors.ui.accent}
          contentStyle={{ paddingHorizontal: 8 }}
          uppercase
        >
          cancel
        </Button>
        <Button
          onPress={onSubmit}
          mode="contained"
          color={theme.colors.ui.accent}
          style={{ borderRadius: 20 }}
          contentStyle={{ paddingHorizontal: 8 }}
          uppercase
          disabled={loading}
        >
          sell
        </Button>
      </Dialog.Actions>
    </>
  )
}

export default ConfirmListForSale
