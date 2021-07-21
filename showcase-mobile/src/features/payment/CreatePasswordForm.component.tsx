import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Divider } from 'react-native-paper'

import { translate } from '../../utils/translator'
import { CreateCryptoWalletInput } from '../../generated/graphql'

import MyKeyboardAwareScrollView from '../../components/MyKeyboardAwareScrollView.component'
import MyTextField from '../../components/MyTextField.component'
import { Spacer } from '../../components/Spacer.component'
import { Alert } from 'react-native'
import { delay } from '../../utils/helpers'
import { useMyModal } from '../../utils/useMyModal'
import { ModalType } from '../../../types/enum'

// todo: confirm password validation
const schema = yup.object().shape({
  password: yup.string().required(),
  password2: yup.string().required(),
  hint: yup.string(),
})

const CreatePasswordForm = () => {
  const theme = useTheme()
  const { handleModal } = useMyModal()
  const { control, handleSubmit, formState } = useForm<
    CreateCryptoWalletInput & { password2: string }
  >({
    defaultValues: {
      password: '',
      password2: '',
      hint: '',
    },
    resolver: yupResolver(schema),
    mode: 'onBlur',
  })

  const onSubmit = async (_formData: CreateCryptoWalletInput) => {
    // do the wallet creation

    const walletCredentials = await delay(1000).then((_r) => ({
      token: 'your wallet is unlocked',
      expirationTime: 10 * 60 * 1000,
    }))

    if (walletCredentials) {
      // save token
      // handle expiry

      // get server response with ew password or get sent password
      // handleFlowData('password', { password: _formData.password })

      Alert.alert(
        JSON.stringify(walletCredentials),
        'please choose the next step',
        [
          {
            text: 'password reminder',
            onPress: () => handleModal(ModalType.STORE_PASSWORD),
          },
          {
            text: 'cancel',
            style: 'cancel',
            onPress: () => handleModal(),
          },
        ],
        { cancelable: true }
      )
    }
  }

  return (
    <>
      <MyKeyboardAwareScrollView>
        <Controller
          name="password"
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
              placeholder={translate().createWalletPassword}
              hasErrorField
              autoCorrect={false}
              secureTextEntry={true}
            />
          )}
        />
        <Controller
          name="password2"
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
              placeholder={translate().createWalletPasswordConfirm}
              hasErrorField
              autoCorrect={false}
              secureTextEntry={true}
            />
          )}
        />
        <Divider />
        <Controller
          name="hint"
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
              placeholder={translate().createWalletPasswordHint}
              hasErrorField
              autoCorrect={false}
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

export default CreatePasswordForm
