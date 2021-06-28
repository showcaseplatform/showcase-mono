import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Image, ImageBackground, View, Pressable } from 'react-native'
import { BlurView } from 'expo-blur'
import { NavigationProp, RouteProp } from '@react-navigation/core'
import { BadgeStackParamList } from '../../../infrastructure/navigation/badges.navigator'
import { Button, Portal, Provider } from 'react-native-paper'
import { useTheme } from 'styled-components'
import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'
import CauseModal from '../components/CauseModal.component'
import { DonationWidget } from '../components/DonationWidget.component'
import { translate } from '../../../utils/translator'
import { makePriceTag, makeSupplyTag } from '../../../utils/helpers'
import { useBadgeTypeQuery } from '../../../generated/graphql'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import Error from '../../../components/Error.component'

type BadgeDetailsScreenProps = {
  route: RouteProp<BadgeStackParamList, 'BadgeDetails'>
  navigation: NavigationProp<BadgeStackParamList>
}

const BadgeDetailsScreen = ({ route, navigation }: BadgeDetailsScreenProps) => {
  const theme = useTheme()
  const { item } = route.params
  const [{ data, fetching, error }] = useBadgeTypeQuery({
    variables: { id: item.id },
  })

  const [showCauseModal, setShowCauseModal] = useState(false)
  const handleCloseModal = () => setShowCauseModal(false)
  const handleOpenModal = () => setShowCauseModal(true)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <Text style={{ color: theme.colors.text.secondary }}>
            {makeSupplyTag(item.sold, item.supply)}
          </Text>
        </View>
      ),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  // hide bottom tab navigator
  // todo: consider to refactor navigation stacks
  useEffect(() => {
    const parent = navigation.dangerouslyGetParent()
    parent &&
      parent.setOptions({
        tabBarVisible: false,
      })
    return () =>
      parent &&
      parent.setOptions({
        tabBarVisible: true,
      })
  }, [navigation])

  if (fetching) {
    return <LoadingIndicator />
  } else if (data) {
    // todo: handle maybe BadgeType data
    const {
      price,
      currency,
      donationAmount,
      image,
      creator: { profile },
      cause,
    } = data.badgeType

    return (
      <>
        <ImageBackground
          source={{ uri: image }}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
          }}
        >
          <BlurView tint="dark" intensity={85}>
            <Image
              source={{ uri: image }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
              }}
              resizeMode="contain"
            />
          </BlurView>
        </ImageBackground>
        {cause && donationAmount && (
          <DonationWidget
            donation={donationAmount}
            image={cause?.image}
            openModal={handleOpenModal}
          />
        )}
        <View // todo: rebuild me as a Portal component & eliminate overlap modal on smaller screens
          style={{
            position: 'absolute',
            bottom: '5%',
            width: '100%',
            paddingHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text variant="body" color="secondary">
              {makePriceTag(price, currency)}
            </Text>
            <Spacer position="y">
              <View flexDirection="row">
                <Text variant="body" color="secondary">
                  {translate().createdBy}
                </Text>
                {profile?.id && (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('Profile', { userId: profile.id })
                    }
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="head"
                      variant="hint"
                      color="secondary"
                      style={{ textDecorationLine: 'underline' }}
                    >
                      {profile?.displayName}
                    </Text>
                  </Pressable>
                )}
              </View>
            </Spacer>
            <Text variant="caption" color="secondary">
              foo bar
            </Text>
          </View>
          <View>
            <Button
              mode="contained"
              color={theme.colors.ui.accent}
              onPress={() => console.log('hello')}
              style={{ borderRadius: 30 }}
              contentStyle={{ paddingHorizontal: 8 }}
              uppercase
            >
              <Text color="secondary">{translate().purchaseButton}</Text>
            </Button>
          </View>
        </View>
        {cause && donationAmount && (
          <Provider>
            <Portal>
              <CauseModal
                isOpen={showCauseModal}
                closeModal={handleCloseModal}
                cause={cause}
                donation={donationAmount}
              />
            </Portal>
          </Provider>
        )}
      </>
    )
  } else if (error) {
    return <Error />
  }
}

export default BadgeDetailsScreen
