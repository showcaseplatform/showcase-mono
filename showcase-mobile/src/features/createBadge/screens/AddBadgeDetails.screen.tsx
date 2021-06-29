import React, { useEffect } from 'react'
import * as FileSystem from 'expo-file-system'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { EditorStackParamList } from '../../../infrastructure/navigation/editor.navigator'

import MyKeyboardAwareScrollView from '../../../components/MyKeyboardAwareScrollView.component'
import { Spacer } from '../../../components/Spacer.component'
import BadgePreviewImage from '../components/BadgePreview.component'
import MyTextFieldComponent from '../../../components/MyTextField.component'
import { Text } from '../../../components/Text.component'
import { translate } from '../../../utils/translator'
import { Button, Divider, Switch } from 'react-native-paper'
import { useTheme } from 'styled-components'
import { StyledSafeArea } from '../../badges/screens/Badges.styles'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import {
  BadgeType,
  PublishBadgeTypeInput,
  useUploadBadgeFileMutation,
} from '../../../generated/graphql'

type BadgeDetails = Pick<
  BadgeType,
  'title' | 'price' | 'supply' | 'description'
>

type AddBadgeDetailsProps = {
  route: RouteProp<EditorStackParamList, 'AddBadgeDetails'>
  navigation: NavigationProp<EditorStackParamList>
}

const defaultValues = {
  title: '',
  price: undefined,
  supply: undefined,
  description: '',
  isFree: false,
}

// todo: define schema details
const schema = yup.object().shape({
  title: yup.string().required(),
  price: yup.number().required(),
  supply: yup.number().required(),
  description: yup.string(),
})

const AddBadgeDetails: React.FC<AddBadgeDetailsProps> = ({
  route,
  navigation,
}) => {
  const { imagePath, category, donation } = route.params
  const theme = useTheme()

  const [, upload] = useUploadBadgeFileMutation()

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, isSubmitting },
    trigger,
  } = useForm<BadgeDetails & { isFree: boolean }>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => isSubmitting && <LoadingIndicator size={24} />,
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    })
  }, [isSubmitting, navigation])

  // todo: hit the create endpoint
  const onSubmit = async (formData: BadgeDetails) => {
    let _data: PublishBadgeTypeInput = {
      title: formData.title,
      description: formData.description,
      category: category.label,
      causeId: Number(donation.cause),
      supply: formData.quantity,
      gif: false,
      price: formData.price as number,
    }

    const file = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    })

    await upload({
      file: {
        base64DataURL: file,
        fileName: _data.title,
        mimeType: 'image/jpeg',
      },
      data: _data,
    })
  }

  return (
    <StyledSafeArea>
      <MyKeyboardAwareScrollView>
        <Spacer size="large" />
        <View>
          <BadgePreviewImage source={imagePath} />
        </View>
        <Spacer position="y" size="large" />
        <Controller
          name="title"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextFieldComponent
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              error={error}
              placeholder="Title"
            />
          )}
        />
        <Text variant="smallBody" color="grey">
          {translate().badgeDetailsTitleInfo}
        </Text>
        <Spacer size="medium" />
        <Controller
          name="price"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextFieldComponent
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value?.toString()}
              error={error}
              placeholder="Price"
              keyboardType="number-pad"
              editable={!getValues('isFree')}
            />
          )}
        />
        <Text variant="smallBody" color="grey">
          {translate().badgeDetailsPriceInfo}
        </Text>
        <Spacer size="medium" />
        <View
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: '100%' }}
        >
          <Text color="grey">{translate().badgeDetailsFree}</Text>
          <Controller
            name="isFree"
            control={control}
            render={({
              field: { onChange, value },
              // fieldState: { error },
            }) => (
              <Switch
                value={value}
                color={theme.colors.ui.accent}
                onValueChange={(val) => {
                  setValue('price', val ? 0 : defaultValues.price)
                  onChange(val)
                  trigger()
                }}
              />
            )}
          />
        </View>
        <Spacer size="medium" />
        <Controller
          name="supply"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextFieldComponent
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value?.toString()}
              error={error}
              placeholder="Quantity"
              keyboardType="number-pad"
            />
          )}
        />
        <Text variant="smallBody" color="grey">
          {translate().badgeDetailsQuantityInfo}
        </Text>
        <Spacer size="medium" />
        <Controller
          name="description"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <MyTextFieldComponent
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              error={error}
              placeholder="Description (optional)"
              numberOfLines={4}
              multiline
            />
          )}
        />
        <Text variant="smallBody" color="grey">
          {translate().badgeDetailsDescriptionInfo}
        </Text>
        {/* ?: keyboard aware view does not handle justifyContent: 'space-between' properly */}
        <View flexGrow={1} />
        <View style={{ width: '100%' }}>
          <Divider />
          <Spacer size="large" />
          <Button
            mode="contained"
            color={theme.colors.ui.accent}
            style={{ borderRadius: 30 }}
            uppercase={false}
            onPress={() => handleSubmit(onSubmit)()}
            disabled={isSubmitting || !isValid}
          >
            {translate().createBadgeButton}
          </Button>
        </View>
      </MyKeyboardAwareScrollView>
    </StyledSafeArea>
  )
}

export default AddBadgeDetails
