import { useEffect } from 'react'
import { Platform, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

async function getRollPermission() {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!')
    }
  }
}

const useCameraRoll = () => {
  useEffect(() => {
    getRollPermission()
  }, [])

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    return result
  }

  return { pickImage }
}

export { useCameraRoll, getRollPermission }
