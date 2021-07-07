import { FlatList, Image, View } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import React, { useState } from 'react'
import { Button, Chip } from 'react-native-paper'
import { BadgeStackParamList } from '../../../infrastructure/navigation/badges.navigator'
import { Ionicons } from '@expo/vector-icons'

import { StyledSafeArea } from './Badges.styles'

import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'
import { useTheme } from 'styled-components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import BadgeItem from '../components/BadgeItem.component'
import { isEven, reshapeBadges } from '../../../utils/helpers'
import EmptyListForProfile from '../components/EmptyListForProfile'
import { CenterView } from '../../../components/CenterView.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import FollowButton from '../../../components/FollowButton.component'
import {
  BadgeType,
  FollowStatus,
  ProfileDocument,
  UserType,
  useToggleFollowMutation,
} from '../../../generated/graphql'
import Error from '../../../components/Error.component'
import { translate } from '../../../utils/translator'
import { useQuery } from '@apollo/client'

type ProfileScreenProps = {
  route: RouteProp<BadgeStackParamList, 'Profile'>
  navigation: NavigationProp<BadgeStackParamList>
}

const createReshapedBadgeKey = (items: BadgeType[], index: number) =>
  `${items[0].id}${items[1]?.id}${index}`

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  let id = route.params.userId

  const { data, loading, error } = useQuery(ProfileDocument, {
    variables: { id },
  })

  const [toggleFollow, { loading: loadingToggle }] = useToggleFollowMutation({
    update(cache, { data }) {
      cache.modify({
        id: cache.identify({
          id,
          __typename: 'User',
        }),
        fields: {
          amIFollowing() {
            return data?.toggleFollow.status === FollowStatus.Accepted
          },
        },
      })
    },
  })

  const [activeTab, setActiveTab] = useState<'created' | 'bought'>('created')
  const theme = useTheme()

  function handleToggleFollow() {
    toggleFollow({ variables: { userId: id } })
  }

  const reshapedCreatedBadgeTypes = reshapeBadges<Partial<BadgeType>>(
    data?.profile?.user.badgeTypesCreated || []
  )
  const reshapedResellBadgeTypes = reshapeBadges<Partial<BadgeType>>(
    data?.profile?.user.badgeTypesForResell || []
  )

  if (loading) {
    return <LoadingIndicator fullScreen />
  } else if (error) {
    return <Error error={error} />
  } else if (data && data.profile) {
    return (
      <StyledSafeArea>
        <View style={{ alignItems: 'center' }}>
          <Spacer position="y" size="large">
            <Image
              resizeMode="contain"
              source={{
                uri:
                  data.profile.avatarUrl ||
                  require('../../../../assets/splash.png'), //todo: temp fallback img
              }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </Spacer>
          <Spacer position="bottom" size="large">
            <Text>{data.profile.username || 'placeholder'}</Text>
          </Spacer>
          {data.profile.user.userType === UserType.Creator && (
            <Spacer position="bottom" size="large">
              <Chip
                icon="check-circle-outline"
                selectedColor="#33ccff"
                textStyle={{ color: theme.colors.text.grey }}
              >
                {translate().verifiedCreator}
              </Chip>
            </Spacer>
          )}
          <CenterView row>
            <FollowButton
              isFollowed={data.profile.user.amIFollowing}
              disabled={loadingToggle}
              onPress={handleToggleFollow}
            />
            <Spacer position="x" size="medium" />
            <Button
              mode="contained"
              color={theme.colors.ui.accent}
              onPress={() =>
                navigation.navigate('Social', {
                  screen: 'Chat',
                  params: {
                    userId: id,
                  },
                })
              }
              style={{ borderRadius: 30 }}
              contentStyle={{ paddingHorizontal: 8 }}
              uppercase={false}
            >
              {translate().messageUserButton}
            </Button>
          </CenterView>
          <View style={{ paddingHorizontal: 20, margin: 25 }}>
            <Text variant="hint" style={{ textAlign: 'center' }}>
              {data.profile.bio}
            </Text>
          </View>
        </View>
        <View style={{ flexGrow: 1, width: '100%' }}>
          <CenterView row>
            <TouchableOpacity
              onPress={() => setActiveTab('created')}
              style={{
                borderBottomWidth: activeTab === 'created' ? 1 : 0,
                paddingBottom: 10,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons name="ios-trophy-outline" size={24} color={'#000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('bought')}
              style={{
                borderBottomWidth: activeTab === 'bought' ? 1 : 0,
                paddingBottom: 10,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons name="ios-cart-outline" size={24} color={'#000'} />
            </TouchableOpacity>
          </CenterView>
          <FlatList
            horizontal
            data={
              activeTab === 'created'
                ? reshapedCreatedBadgeTypes
                : reshapedResellBadgeTypes
            }
            keyExtractor={createReshapedBadgeKey}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
            ListEmptyComponent={EmptyListForProfile}
            renderItem={({ item }) => (
              <View>
                <BadgeItem
                  item={item[0]}
                  onPress={() =>
                    navigation.navigate('BadgeDetails', { item: item[0] })
                  }
                  key={item[0].id}
                  withoutInfo
                />
                {isEven(item.length) && (
                  <BadgeItem
                    item={item[1]}
                    onPress={() =>
                      navigation.navigate('BadgeDetails', { item: item[1] })
                    }
                    key={item[1].id}
                    withoutInfo
                  />
                )}
              </View>
            )}
          />
        </View>
      </StyledSafeArea>
    )
  }
}

export default ProfileScreen
