import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import { RouteProp } from '@react-navigation/core'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {
  ImageInfo,
  ImagePickerResult,
} from 'expo-image-picker/build/ImagePicker.types'

import { useCameraRoll } from '../../../utils/useCameraRoll'
import { translate } from '../../../utils/translator'
import { EditorStackParamList } from '../../../infrastructure/navigation/editor.navigator'

import { CenterView } from '../../../components/CenterView.component'
import { Text } from '../../../components/Text.component'
import { Editor } from '../components/Editor.component'
import HeaderActionButton from '../../../components/HeaderActionButton.component'
import { StyledSafeArea } from '../../badges/screens/Badges.styles'
import { GLView } from 'expo-gl'

type CreateBadgeProps = {
  route: RouteProp<EditorStackParamList, 'CreateBadge'>
  navigation: NavigationProp<EditorStackParamList>
}

type SelectedImageState = (ImagePickerResult & Partial<ImageInfo>) | undefined

// todo: if image initialy fetching show loading, and hide openGL artifact
const CreateBadge: React.FC<CreateBadgeProps> = ({ route, navigation }) => {
  const { category } = route?.params
  const { pickImage } = useCameraRoll()
  const [selectedImageInfo, setSelectedImageInfo] =
    useState<SelectedImageState>(undefined)
  const [filteredImageRef, setFilteredImageRef] = useState<GLView | null>(null)

  // on first render open image picker modal
  useEffect(() => {
    handlePickImage()
    return () => setSelectedImageInfo(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveAndNext = useCallback(async () => {
    const filteredImage = await filteredImageRef?.glView.capture()
    filteredImage &&
      navigation.navigate('SelectCause', {
        category,
        image: filteredImage,
        imagePath: filteredImage.localUri,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredImageRef?.glView])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderActionButton
          title={translate().creatorHeaderNext}
          disabled={!selectedImageInfo?.uri}
          onPress={handleSaveAndNext}
        />
      ),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    })
  }, [handleSaveAndNext, navigation, selectedImageInfo?.uri])

  const handlePickImage = () => {
    pickImage().then((result) => setSelectedImageInfo(result))
  }

  // todo: style me
  if (!selectedImageInfo || selectedImageInfo.cancelled) {
    return (
      <StyledSafeArea>
        <CenterView flex={1}>
          <TouchableOpacity onPress={handlePickImage}>
            <Text>Select an image</Text>
          </TouchableOpacity>
        </CenterView>
      </StyledSafeArea>
    )
  }

  return (
    <StyledSafeArea>
      <Editor
        imageUri={selectedImageInfo.uri}
        setImageRef={setFilteredImageRef}
      />
    </StyledSafeArea>
  )
}

export default CreateBadge
