import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Button } from 'react-native-paper'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import valid from 'card-validator'

import { countries } from '../../utils/authentication.utils'
import { translate } from '../../utils/translator'
import { delay } from '../../utils/helpers'
import {
  AmIAllowedToBuyDocument,
  useAddPaymentMutation,
} from '../../generated/graphql'

import MyKeyboardAwareScrollView from '../../components/MyKeyboardAwareScrollView.component'
import MySelectInputComponent from '../../components/MySelectInput.component'
import MyTextField from '../../components/MyTextField.component'
import { Spacer } from '../../components/Spacer.component'

// type PaymentFormData = Pick<PaymentInfo,'lastFourCardDigit'>
type AddPaymentCardInputs = {
  cardNumber: string
  cvc: string
  expirationMonth: string
  expirationYear: string
  name: string
  address: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
}

const schema = yup.object().shape({
  cardNumber: yup
    .string()
    .test(
      'test-cardNumber',
      'Credit Card number is invalid',
      (val) => valid.number(val).isValid
    )
    .required(),
  cvc: yup
    .string()
    .test('test-cvc', 'CVC is invalid', (val) => valid.cvv(val).isValid)
    .required(),
  expirationMonth: yup
    .string()
    .test(
      'test-expirationMonth',
      'Expiration month is invalid',
      (val) => valid.expirationMonth(val).isValid
    )
    .required(),
  expirationYear: yup
    .string()
    .test(
      'test-expirationYear',
      'Expiration year is invalid',
      (val) => valid.expirationYear(val).isValid
    )
    .required(),
  name: yup
    .string()
    .test(
      'test-Name',
      'Name is invalid',
      (val) => valid.cardholderName(val).isValid
    )
    .required(),
  address: yup.string().required(),
  address2: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zip: yup
    .string()
    .test('test-Name', 'Zip is invalid', (val) => valid.postalCode(val).isValid)
    .required(),
  country: yup.string().required(),
})

const AddPaymentCardForm = ({ onCompleted }: { onCompleted: () => void }) => {
  const theme = useTheme()
  const [addPayment] = useAddPaymentMutation({
    onCompleted,
    refetchQueries: [{ query: AmIAllowedToBuyDocument }],
  })

  const { control, handleSubmit, formState } = useForm<AddPaymentCardInputs>({
    defaultValues: {
      cardNumber: '',
      cvc: '',
      expirationMonth: '',
      expirationYear: '',
      name: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    },
    resolver: yupResolver(schema),
    mode: 'onTouched',
  })

  const onSubmit = async (_formData: AddPaymentCardInputs) => {
    // send info to a payment service than receive payment auth token

    // TEMP
    // validate then return a fake payment service token with short expiration time
    const paymentCredentials = await delay(1000).then((_r) => ({
      token: 'faketoken' + Date.now(),
      expirationTime: 10 * 60 * 1000,
    }))

    if (paymentCredentials) {
      const getLastFour = (number: number | string) => {
        let arr
        arr = number.toString().split('')

        return arr.splice(arr.length - 4, arr.length - 1).join('')
      }

      const data = {
        idToken: paymentCredentials.token,
        lastFourCardDigit: getLastFour(_formData.cardNumber),
      }

      await addPayment({
        variables: { data },
      })
    }
  }

  return (
    <>
      <MyKeyboardAwareScrollView>
        <Controller
          name="cardNumber"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextField
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value?.toString()}
              error={error}
              placeholder={translate().inputCardNumber}
              hasErrorField
              autoCorrect={false}
              keyboardType="decimal-pad"
            />
          )}
        />
        <View flexDirection="row">
          <View flex={1}>
            <Controller
              name="cvc"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <MyTextField
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value.toString()}
                  error={error}
                  placeholder={translate().inputCVC}
                  hasErrorField
                  autoCorrect={false}
                  maxLength={3}
                  keyboardType="decimal-pad"
                />
              )}
            />
          </View>
          <Spacer position="right" size="large" />
          <View flex={1}>
            <Controller
              name="expirationMonth"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <MyTextField
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value.toString()}
                  error={error}
                  placeholder={translate().inputExpMonth}
                  hasErrorField
                  autoCorrect={false}
                  style={{ flex: 1 }}
                  maxLength={2}
                  keyboardType="decimal-pad"
                />
              )}
            />
          </View>
          <Spacer position="right" size="large" />
          <View flex={1}>
            <Controller
              name="expirationYear"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <MyTextField
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value.toString()}
                  error={error}
                  placeholder={translate().inputExpYear}
                  hasErrorField
                  autoCorrect={false}
                  maxLength={4}
                  keyboardType="decimal-pad"
                />
              )}
            />
          </View>
        </View>
        <Controller
          name="name"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextField
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              error={error}
              placeholder={translate().inputName}
              hasErrorField
              autoCorrect={false}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextField
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              error={error}
              placeholder={translate().inputAddressLineOne}
              hasErrorField
              autoCorrect={false}
            />
          )}
        />
        <Controller
          name="address2"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextField
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              error={error}
              placeholder={translate().inputAddressLineTwo}
              hasErrorField
              autoCorrect={false}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextField
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              error={error}
              placeholder={translate().inputAddressCity}
              hasErrorField
              autoCorrect={false}
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextField
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              error={error}
              placeholder={translate().inputAddressState}
              hasErrorField
              autoCorrect={false}
            />
          )}
        />
        <Controller
          name="zip"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextField
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value.toString()}
              error={error}
              placeholder={translate().inputAddressZip}
              hasErrorField
              autoCorrect={false}
              keyboardType="decimal-pad"
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <MySelectInputComponent
              placeholder={translate().balanceCurrencyLabel}
              items={countries}
              value={value}
              onValueChange={(val) => onChange(val)}
              error={error}
              hasErrorField
            />
          )}
        />
      </MyKeyboardAwareScrollView>
      <Spacer position="top" size="medium">
        <Button
          mode="contained"
          color={theme.colors.ui.accent}
          style={{ borderRadius: 30 }}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={formState.isSubmitting}
        >
          {translate().submitButton}
        </Button>
      </Spacer>
    </>
  )
}

export default AddPaymentCardForm
