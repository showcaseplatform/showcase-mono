import React, { useCallback, useLayoutEffect, useState } from 'react'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { UserStackParamList } from '../../../infrastructure/navigation/user.navigator'

import { translate } from '../../../utils/translator'
import { currencies } from '../../../utils/currencies'
import { eighteenYearsAgo } from '../../../utils/helpers'
import { useCameraRoll } from '../../../utils/useCameraRoll'

import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import MyTextField from '../../../components/MyTextField.component'
import MyKeyboardAwareScrollView from '../../../components/MyKeyboardAwareScrollView.component'
import MySelectInputComponent from '../../../components/MySelectInput.component'
import MyDatePickerInput from '../../../components/MyDatePickerInput.component'
import HeaderActionButton from '../../../components/HeaderActionButton.component'
import ProfileImage from '../../../components/ProfileImage.component'
import {
  UpdateProfileInput,
  useMeQuery,
  useUpdateMeMutation,
} from '../../../generated/graphql'
import LoadingIndicator from '../../../components/LoadingIndicator.component'

type EditProfileScreenProps = {
  route: RouteProp<UserStackParamList, 'EditUserProfile'>
  navigation: NavigationProp<UserStackParamList>
}

const schema = yup.object().shape({
  displayName: yup
    .string()
    .max(36)
    .required('Please provide your display name'),
  username: yup
    .string()
    .required('Please provide your user name')
    .max(28, 'Maximum 28 characters allowed')
    .matches(/^[a-zA-Z0-9_]+$/g),
  email: yup.string().email().required('Please provide your email'),
  currency: yup.string().required('Please provide your choosen currency'),
  birthDate: yup
    .date()
    .max(new Date(eighteenYearsAgo), 'You must over 18 years')
    .required('Please provide your date of birth'),
  bio: yup.string().max(240, 'Maximum 240 characters allowed'),
})

// todo: implement auto-focus on fields
const EditUserProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const [{ data, fetching, error }, refetchMe] = useMeQuery()
  const [{ fetching: updating, error: updateError }, updateMe] =
    useUpdateMeMutation()

  const { avatar, displayName, username, email, currency, birthDate, bio } =
    data?.me.profile

  const { control, handleSubmit } = useForm<UpdateProfileInput>({
    defaultValues: {
      displayName,
      username,
      email,
      currency,
      birthDate,
      bio,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const [profileImg, setProfileImg] = useState<string | undefined>(avatar)
  const [uploading, setUploading] = useState(false)
  const { pickImage } = useCameraRoll()

  const onSubmit = useCallback(
    async (formData: UpdateProfileInput) => {
      await updateMe({ data: formData })
      if (!error) {
        await refetchMe({ requestPolicy: 'network-only' }) // todo: create similar logic in client
      }
      if (!updateError) {
        navigation.goBack()
      }
    },
    [error, navigation, refetchMe, updateError, updateMe]
  )

  // ?: temp file upload
  const onChangeProfileImage = async () => {
    pickImage().then((res) => {
      if (!res) {
        return
      }

      setUploading(true)
      setTimeout(() => {
        setUploading(false)
        setProfileImg(res?.uri)
      }, 1000)
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return updating ? (
          <LoadingIndicator size={32} />
        ) : (
          <HeaderActionButton
            title={translate().profileOptionsEditSave}
            onPress={() => handleSubmit(onSubmit)()}
          />
        )
      },

      headerRightContainerStyle: {
        paddingRight: 10,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updating])

  return (
    <MyKeyboardAwareScrollView>
      <Spacer position="y" size="large">
        <ProfileImage
          source={profileImg}
          loading={uploading}
          onClick={onChangeProfileImage}
        />
      </Spacer>
      <Text>{translate().profileEditPhoto}</Text>
      <Spacer />
      <Controller
        name="displayName"
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
            placeholder="Display Name"
            hasErrorField
            autoCorrect={false}
          />
        )}
      />
      <Text variant="smallBody" color="grey" center>
        {translate().profileEditUsernameText}
      </Text>
      <Controller
        name="username"
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
            placeholder="User Name"
            hasErrorField
            autoCorrect={false}
          />
        )}
      />
      <Controller
        name="email"
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
            placeholder="Email"
            hasErrorField
            autoCorrect={false}
          />
        )}
      />
      <Controller
        name="currency"
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <MySelectInputComponent
            placeholder={translate().balanceCurrencyLabel}
            items={currencies}
            value={value}
            onBlur={onBlur}
            onValueChange={(val) => onChange(val)}
            error={error}
            hasErrorField
          />
        )}
      />
      <Controller
        control={control}
        name="birthDate"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <MyDatePickerInput
            value={value}
            onConfirm={onChange}
            error={error}
            placeholder="Your date of birth"
            // maximumDate={} // ?: disable dates after '18 years from now?'
            hasErrorField
          />
        )}
      />
      <Controller
        name="bio"
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
            placeholder="Bio"
            multiline
            numberOfLines={4}
            hasErrorField
          />
        )}
      />
    </MyKeyboardAwareScrollView>
  )
}

export default EditUserProfileScreen
