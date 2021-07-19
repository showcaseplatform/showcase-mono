import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import * as yup from 'yup'
import { Button } from 'react-native-paper'
import { yupResolver } from '@hookform/resolvers/yup'
// import cardValidator from 'card-validator'

import { countries } from '../../utils/authentication.utils'
import { translate } from '../../utils/translator'

import MyKeyboardAwareScrollView from '../../components/MyKeyboardAwareScrollView.component'
import MySelectInputComponent from '../../components/MySelectInput.component'
import MyTextField from '../../components/MyTextField.component'
import { Spacer } from '../../components/Spacer.component'

import { MeDocument, useAddPaymentMutation } from '../../generated/graphql'

import { delay } from '../../utils/helpers'
import { useMyModal } from '../../utils/useMyModal'

// type PaymentFormData = Pick<PaymentInfo,'lastFourCardDigit'>
type AddPaymentCardInputs = {
  cardNumber: number
  cvc: number
  expirationMonth: number
  expirationYear: number
  name: string
  address: string
  address2: string
  city: string
  state: string
  zip: number
  country: string
}

// todo: card validator
const schema = yup.object().shape({
  cardNumber: yup.number().required(),
  cvc: yup.number().required(),
  expirationMonth: yup.number().min(2).max(2).lessThan(13).required(),
  expirationYear: yup
    .number()
    .min(2)
    .max(2)
    .moreThan(19)
    .lessThan(30)
    .required(),
  name: yup.string().required(),
  address: yup.string().required(),
  address2: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zip: yup.number().required(),
  country: yup.string().required(),
})

const AddPaymentCardForm = () => {
  const theme = useTheme()
  const [addPayment] = useAddPaymentMutation({
    refetchQueries: [{ query: MeDocument }],
  })

  const { control, handleSubmit, formState } = useForm<AddPaymentCardInputs>({
    defaultValues: {
      // cardNumber: undefined,
      // cvc: undefined,
      // expirationMonth: undefined,
      // expirationYear: undefined,
      // name: '',
      // address: '',
      // address2: '',
      // city: '',
      // state: '',
      // zip: undefined,
      // country: undefined,
      cardNumber: 1000008888,
      cvc: 1,
      expirationMonth: 11,
      expirationYear: 22,
      name: 'X',
      address: 'A',
      address2: 'B',
      city: 'C',
      state: 'D',
      zip: 4281,
      country: 'US',
    },
    resolver: yupResolver(schema),
    mode: 'onBlur',
  })

  const { handleModal } = useMyModal()

  const onSubmit = async (_formData: AddPaymentCardInputs) => {
    // send info to a payment service than receive payment auth token

    // TEMP
    // validate then return a fake payment service token with short expiration time
    const paymentCredentials = await delay(1000).then((_r) => ({
      token: 'faketoken' + Date.now(),
      expirationTime: 10 * 60 * 1000,
    }))

    if (paymentCredentials) {
      const getLastFour = (number: number) => {
        let arr
        arr = number.toString().split('')

        return arr.splice(arr.length - 4, arr.length - 1).join('')
      }

      const data = {
        idToken: paymentCredentials.token,
        lastFourCardDigit: getLastFour(_formData.cardNumber),
      }

      const result = await addPayment({
        variables: { data },
      })

      if (result.data?.addPaymentInfo.paymentInfo?.lastFourCardDigit) {
        // TODO: continue buy flow
        handleModal()
      }
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
              onChangeText={(val) => onChange(val && parseInt(val))}
              value={value.toString()}
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
                  onChangeText={(val) => onChange(val && parseInt(val))}
                  value={value.toString()}
                  error={error}
                  placeholder={translate().inputCVC}
                  hasErrorField
                  autoCorrect={false}
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
                  onChangeText={(val) => onChange(val && parseInt(val))}
                  value={value.toString()}
                  error={error}
                  placeholder={translate().inputExpYear}
                  hasErrorField
                  autoCorrect={false}
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
              onChangeText={(val) => onChange(val && parseInt(val))}
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
