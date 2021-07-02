import React, { useMemo, useState } from 'react'
import { FlatList, View } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Button, Chip } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from 'styled-components'

import { BadgeStackParamList } from '../../../infrastructure/navigation/badges.navigator'
import { isEven, reshapeBadges } from '../../../utils/helpers'
import {
  BadgeType,
  useProfileQuery,
  UserType,
  useToggleFollowMutation,
} from '../../../generated/graphql'
import { translate } from '../../../utils/translator'
import { StyledSafeArea } from './Badges.styles'

import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'
import BadgeItem from '../components/BadgeItem.component'
import EmptyListForProfile from '../components/EmptyListForProfile'
import { CenterView } from '../../../components/CenterView.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import FollowButton from '../../../components/FollowButton.component'
import Error from '../../../components/Error.component'
import TabSelectorButtonComponent from '../components/TabSelectorButton.component'
import ProfileImage from '../../../components/ProfileImage.component'

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
  const [{ data, fetching, error }] = useProfileQuery({
    variables: { id },
  })
  const [{ fetching: fetchingToggle }, toggleFollow] = useToggleFollowMutation()

  const [activeTab, setActiveTab] = useState<BadgeTabType>(
    inventoryTabs[1].name
  )
  const isCreator = data?.profile?.user.userType === UserType.Creator

  function handleToggleFollow() {
    toggleFollow({ userId: id })
  }

  const reshapedCreatedBadgeTypes = useMemo(
    () =>
      reshapeBadges<Partial<BadgeType>>(
        data?.profile?.user.badgeTypesCreated || []
      ),
    [data?.profile?.user.badgeTypesCreated]
  )
  const reshapedResellBadgeTypes = useMemo(
    () =>
      reshapeBadges<Partial<BadgeType>>(
        data?.profile?.user.badgeTypesForResell || []
      ),
    [data?.profile?.user.badgeTypesForResell]
  )
  const reshapedOwnedBadgeTypes = useMemo(
    () =>
      reshapeBadges<Partial<BadgeType>>(
        data?.profile?.user.badgeItemsOwned.badgeType || []
      ),
    [data?.profile?.user.badgeItemsOwned]
  )

  if (fetching) {
    return <LoadingIndicator fullScreen />
  } else if (data && data.profile) {
    return (
      <StyledSafeArea>
        <View style={{ alignItems: 'center' }}>
          <Spacer position="y" size="large">
            <ProfileImage
              small={false}
              source={data.profile.avatar as string | undefined}
            />
          </Spacer>
          <Spacer position="bottom" size="large">
            <Text>{data.profile.username || 'placeholder'}</Text>
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
              isFollowed={data.profile.user.amIFollowing}
              disabled={fetchingToggle}
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
  } else if (error) {
    return <Error />
  }
}

export default ProfileScreen
