import React, { useCallback, useLayoutEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system'
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
  MeDocument,
  UpdateProfileInput,
  useUpdateMeMutation,
} from '../../../generated/graphql'
import LoadingIndicator from '../../../components/LoadingIndicator.component'

type EditProfileScreenProps = {
  route: RouteProp<UserStackParamList, 'EditUserProfile'>
  navigation: NavigationProp<UserStackParamList>
}

// extends ImagePickerResult
type PickedImageResult = {
  cancelled: boolean
  uri: string
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
  bio: yup.string().max(240, 'Maximum 240 characters allowed').nullable(),
})

// todo: implement auto-focus on fields
const EditUserProfileScreen = ({
  navigation,
  route,
}: EditProfileScreenProps) => {
  const { user: data } = route.params
  const [updateMe, { loading: updating }] = useUpdateMeMutation({
    onCompleted: (_) => navigation.goBack(),
    refetchQueries: [{ query: MeDocument }],
  })

  const { avatarUrl, displayName, username, email, currency, birthDate, bio } =
    data?.profile

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

  const [pickedImage, setPickedImage] = useState<PickedImageResult | null>(null)
  const [uploading, setUploading] = useState(false)
  const { pickImage } = useCameraRoll()

  const onSubmit = useCallback(
    async (formData: UpdateProfileInput) => {
      let file

      if (pickedImage?.uri) {
        const base64DataURL = await FileSystem.readAsStringAsync(
          pickedImage.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        )
        const mimeType = `image/${pickedImage.uri.split('.').reverse()[0]}`

        file = {
          base64DataURL,
          mimeType,
        }
      }

      await updateMe({
        variables: {
          file: file ?? undefined,
          data: formData,
        },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickedImage]
  )

  const onChangeProfileImage = () => {
    setUploading(true)
    pickImage().then((value: PickedImageResult) => {
      setUploading(false)
      setPickedImage(value)
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
  }, [handleSubmit, navigation, onSubmit, updating])

  return (
    <MyKeyboardAwareScrollView>
      <Spacer position="y" size="large">
        <ProfileImage
          source={pickedImage?.uri || avatarUrl}
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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <MySelectInputComponent
            placeholder={translate().balanceCurrencyLabel}
            items={currencies}
            value={value}
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
            minimumDate={new Date(1901, 0, 1)}
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
