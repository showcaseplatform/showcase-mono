import React, { useLayoutEffect, useState } from 'react'
import { Dimensions, Image } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'
import { Button } from 'react-native-paper'
import Slider from '@react-native-community/slider'

import HeaderActionButton from '../../../components/HeaderActionButton.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { EditorStackParamList } from '../../../infrastructure/navigation/editor.navigator'
import { StyledSafeArea } from '../../badges/screens/Badges.styles'
import { translate } from '../../../utils/translator'
import { FlatGrid } from 'react-native-super-grid'
import { useCausesQuery } from '../../../generated/graphql'
import LoadingIndicator from '../../../components/LoadingIndicator.component'

type SelectCauseProps = {
  route: RouteProp<EditorStackParamList, 'SelectCause'>
  navigation: NavigationProp<EditorStackParamList>
}

const width = Dimensions.get('window').width

const SelectCause: React.FC<SelectCauseProps> = ({ route, navigation }) => {
  const { category, imagePath, image } = route.params
  const theme = useTheme()

  const { data, loading } = useCausesQuery({ fetchPolicy: 'cache-first' })

  const [donationPercent, setDonationPercent] = useState(5)
  const [selectedCause, setSelectedCause] = useState<number | null>(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderActionButton
          title={translate().causeChooseSkip}
          onPress={handleNavigation}
        />
      ),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const handleToggleSelect = (causeId: number) => {
    if (selectedCause !== causeId) {
      setSelectedCause(causeId)
    } else {
      setSelectedCause(null)
    }
  }

  const handleNavigation = () => {
    let donation = {}
    if (selectedCause) {
      donation = {
        causeId: selectedCause,
        donationPercent: donationPercent > 0 ? donationPercent / 100 : 0, // todo: fix me: some place is float other is Int
      }
    }
    navigation.navigate('AddBadgeDetails', {
      category,
      imagePath,
      donation,
      image,
    })
  }

  return (
    <StyledSafeArea>
      <Spacer position="all" size="large">
        <Text center color="grey">
          {translate().causeChooseInfo}
        </Text>
      </Spacer>
      {loading ? (
        <LoadingIndicator fullScreen />
      ) : (
        <FlatGrid
          flexGrow={1}
          itemDimension={width / 3}
          data={data?.causes}
          spacing={0}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 20,
                borderWidth: 1,
                borderColor:
                  selectedCause === item.id
                    ? theme.colors.ui.accent
                    : 'transparent',
              }}
              onPress={() => handleToggleSelect(item.id)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                resizeMode="contain"
                style={{ width: '100%', height: undefined, aspectRatio: 1 / 1 }}
              />
            </TouchableOpacity>
          )}
        />
      )}

      <Spacer position="x" size="large">
        <Slider
          minimumValue={0}
          maximumValue={30}
          value={donationPercent}
          onSlidingComplete={(val) => setDonationPercent(val)}
          minimumTrackTintColor={
            selectedCause ? theme.colors.ui.accent : theme.colors.ui.disabled
          }
          maximumTrackTintColor={theme.colors.ui.disabled}
          disabled={!selectedCause}
          step={1}
        />
        <Spacer size="medium" />
        <Button
          mode="contained"
          color={theme.colors.ui.accent}
          style={{ borderRadius: 30 }}
          uppercase={false}
          disabled={!selectedCause || donationPercent < 1}
          onPress={handleNavigation}
        >
          {selectedCause
            ? `${translate().selectCauseButton} ${donationPercent}%`
            : 'Please select a Cause'}
        </Button>
      </Spacer>
    </StyledSafeArea>
  )
}

export default SelectCause
