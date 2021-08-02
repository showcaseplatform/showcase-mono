import React, { useState, useLayoutEffect } from 'react'
import { FlatList, View } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Button, Chip } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'

import { BadgeStackParamList } from '../../../infrastructure/navigation/badges.navigator'
import { isEven, reshapeBadges } from '../../../utils/helpers'
import {
  BadgeType,
  // FollowStatus,
  MeDocument,
  UserType,
  useToggleFollowMutation,
  useUserQuery,
} from '../../../generated/graphql'
import { translate } from '../../../utils/translator'
import { StyledSafeArea } from './Badges.styles'

import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'
import BadgeItem from '../components/BadgeItem.component'
import { CenterView } from '../../../components/CenterView.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import FollowButton from '../../../components/FollowButton.component'
import Error from '../../../components/Error.component'
import ProfileImage from '../../../components/ProfileImage.component'
import TabSelectorButtonComponent from '../components/TabSelectorButton.component'
import EmptyListComponent from '../../../components/EmptyList.component'

type ProfileScreenProps = {
  route: RouteProp<BadgeStackParamList, 'Profile'>
  navigation: NavigationProp<BadgeStackParamList>
}

enum BadgeTabType {
  created = 'created',
  resell = 'resell',
  owned = 'owned',
}

type BadgeTab = {
  name: BadgeTabType
  iconName: React.ComponentProps<typeof Ionicons>['name']
}
export interface BadgeTabProps extends BadgeTab {
  isActive: boolean
  onPress: (tabType: BadgeTabType) => void
}

const inventoryTabs: BadgeTab[] = [
  {
    name: BadgeTabType.created,
    iconName: 'ios-trophy-outline',
  },
  {
    name: BadgeTabType.resell,
    iconName: 'ios-cart-outline',
  },
  {
    name: BadgeTabType.owned,
    iconName: 'library-outline',
  },
]

const createReshapedBadgeKey = (items: BadgeType[], index: number) =>
  `${items[0].id}${items[1]?.id}${index}`

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  let id = route.params.userId
  const theme = useTheme()

  const { data, loading, error } = useUserQuery({
    variables: { id },
  })

  const isCreator = data?.user?.userType === UserType.Creator

  const [activeTab, setActiveTab] = useState<BadgeTabType>(
    inventoryTabs[isCreator ? 0 : 2].name
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.user?.profile?.displayName,
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    })
  }, [data?.user?.profile?.displayName, navigation])

  const [toggleFollow, { loading: loadingToggle }] = useToggleFollowMutation({
    // update(cache, { data: data_ }) {
    //   cache.modify({
    //     id: cache.identify({
    //       id,
    //       __typename: 'User',
    //     }),
    //     fields: {
    //       amIFollowing() {
    //         return data_?.toggleFollow.status === FollowStatus.Accepted
    //       },
    //     },
    //   })
    // },
    refetchQueries: [{ query: MeDocument }],
  })

  function handleToggleFollow() {
    toggleFollow({ variables: { userId: id } })
  }

  const reshapedCreatedBadgeTypes = reshapeBadges<Partial<BadgeType>>(
    data?.user?.badgeTypesCreated || []
  )
  const reshapedResellBadgeTypes = reshapeBadges<Partial<BadgeType>>(
    data?.user?.badgeItemsForSale.map(({ badgeType }) => badgeType) || []
  )
  const reshapedOwnedBadgeTypes = reshapeBadges<Partial<BadgeType>>(
    data?.user?.badgeItemsToShow.map(({ badgeType }) => badgeType) || []
  )

  if (loading) {
    return <LoadingIndicator fullScreen />
  } else if (error) {
    return <Error error={error} />
  } else if (data && data.user) {
    return (
      <StyledSafeArea>
        <View style={{ alignItems: 'center' }}>
          <Spacer position="y" size="large">
            <ProfileImage source={data.user.profile?.avatarUrl} />
          </Spacer>
          <Spacer position="bottom" size="large">
            <Text>{data.user.profile?.username || 'placeholder'}</Text>
          </Spacer>
          {isCreator && (
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
              isFollowed={data.user.amIFollowing}
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
              {data.user.profile?.bio}
            </Text>
          </View>
        </View>
        <View style={{ flexGrow: 1, width: '100%' }}>
          <CenterView row>
            {inventoryTabs.map((tab, index) => {
              return !isCreator && index === 0 ? null : (
                <TabSelectorButtonComponent
                  name={tab.name}
                  iconName={tab.iconName}
                  isActive={activeTab === tab.name}
                  onPress={setActiveTab}
                  key={`${tab.name}-index`}
                />
              )
            })}
          </CenterView>
          <FlatList
            horizontal
            data={
              activeTab === BadgeTabType.created
                ? reshapedCreatedBadgeTypes
                : activeTab === BadgeTabType.owned
                ? reshapedOwnedBadgeTypes
                : reshapedResellBadgeTypes
            }
            keyExtractor={createReshapedBadgeKey}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
            ListEmptyComponent={<EmptyListComponent text="No Badges yet." />}
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
