import React, { useEffect, useState, useLayoutEffect } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { NavigationProp, RouteProp } from '@react-navigation/core'
import { Button, Portal, Provider } from 'react-native-paper'
import { useTheme } from 'styled-components'

import useBuyBadge from '../../../hooks/useBuyBadge'
import { BadgeStackParamList } from '../../../infrastructure/navigation/badges.navigator'
import { translate } from '../../../utils/translator'
import { makePriceTag, makeSupplyTag } from '../../../utils/helpers'
import {
  BadgeDetailsDocument,
  useBadgeDetailsQuery,
  useCountBadgeViewMutation,
  useToggleLikeMutation,
} from '../../../generated/graphql'

import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'
import CauseModal from '../components/CauseModal.component'
import { DonationWidget } from '../components/DonationWidget.component'
import Error from '../../../components/Error.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import {
  InfoWrapper,
  MyImage,
  MyImageBackground,
} from '../components/BadgeDetails.styles'
import { CenterView } from '../../../components/CenterView.component'

type BadgeDetailsScreenProps = {
  route: RouteProp<BadgeStackParamList, 'BadgeDetails'>
  navigation: NavigationProp<BadgeStackParamList>
}

const BadgeDetailsScreen = ({ route, navigation }: BadgeDetailsScreenProps) => {
  const theme = useTheme()
  const { badgeType } = route.params
  const { data, loading, error } = useBadgeDetailsQuery({
    variables: { id: route.params.badgeType.id },
  })

  const { buyItem } = useBuyBadge(badgeType.id)

  const [toggleLike] = useToggleLikeMutation({
    variables: { isBadgeType: true, badgeId: badgeType.id },
    refetchQueries: [
      { query: BadgeDetailsDocument, variables: { id: badgeType.id } },
    ],
  })

  const [countView] = useCountBadgeViewMutation({
    variables: { isBadgeType: true, badgeId: badgeType.id },
    refetchQueries: [
      { query: BadgeDetailsDocument, variables: { id: badgeType.id } },
    ],
  })

  const [showCauseModal, setShowCauseModal] = useState(false)
  const handleCloseModal = () => setShowCauseModal(false)
  const handleOpenModal = () => setShowCauseModal(true)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{ color: theme.colors.text.secondary }}>
          {makeSupplyTag(badgeType.sold, badgeType.supply)}
        </Text>
      ),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  useEffect(() => {
    if (data && !data.badgeType?.isViewedByMe) {
      countView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // hide bottom tab navigator
  // todo: consider to refactor navigation stacks to avoid hide/show glitches
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

  if (loading) {
    return <LoadingIndicator fullScreen />
  }

  if (data?.badgeType) {
    const {
      donationAmount,
      creator: { profile },
      cause,
      publicUrl,
      isOwnedByMe,
      isCreatedByMe,
      availableToBuyCount,
      viewCount,
      likeCount,
      isLikedByMe,
    } = data.badgeType

    return (
      <>
        <MyImageBackground source={{ uri: publicUrl }}>
          <BlurView tint="dark" intensity={85}>
            <MyImage source={{ uri: publicUrl }} resizeMode="contain" />
          </BlurView>
        </MyImageBackground>
        {cause && donationAmount && (
          <DonationWidget
            donation={donationAmount}
            image={cause?.imageUrl}
            openModal={handleOpenModal}
          />
        )}
        <InfoWrapper>
          <View style={{ flex: 1 }}>
            <Text variant="body" color="secondary">
              {makePriceTag(badgeType.price, badgeType.currency)}
            </Text>
            <Spacer position="y" size="medium">
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
            <View style={{ flexDirection: 'row' }}>
              <CenterView row>
                <Ionicons
                  size={32}
                  name="eye-outline"
                  color={theme.colors.text.grey}
                />
                <Spacer position="right" />
                <Text variant="label" color="secondary">
                  {viewCount}
                </Text>
              </CenterView>
              <Spacer position="x" size="large" />
              <CenterView row>
                <Ionicons
                  size={32}
                  name={isLikedByMe ? 'heart' : 'heart-outline'}
                  color={
                    isLikedByMe
                      ? theme.colors.text.accent
                      : theme.colors.text.grey
                  }
                  onPress={() => toggleLike()}
                />
                <Spacer position="right" />
                <Text variant="label" color="secondary">
                  {likeCount}
                </Text>
              </CenterView>
            </View>
          </View>
          <Button
            mode="contained"
            color={theme.colors.ui.accent}
            onPress={buyItem}
            style={{ borderRadius: 30 }}
            contentStyle={{ paddingHorizontal: 8 }}
            disabled={availableToBuyCount < 1 || isCreatedByMe || isOwnedByMe}
            uppercase
          >
            <Text color="secondary">
              {availableToBuyCount < 1
                ? translate().outOfStock
                : isCreatedByMe
                ? translate().yourCreation
                : isOwnedByMe
                ? translate().alreadyOwned
                : translate().purchaseButton}
            </Text>
          </Button>
        </InfoWrapper>
        <Provider>
          <Portal>
            {cause && donationAmount && (
              <CauseModal
                isOpen={showCauseModal}
                closeModal={handleCloseModal}
                cause={cause}
                donation={donationAmount}
              />
            )}
          </Portal>
        </Provider>
      </>
    )
  } else {
    return <Error error={error} />
  }
}

export default BadgeDetailsScreen
