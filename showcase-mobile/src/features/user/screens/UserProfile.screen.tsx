import React, { useLayoutEffect, useMemo, useState } from 'react'
import { View, FlatList, Pressable, Share } from 'react-native'
import { NavigationProp, RouteProp } from '@react-navigation/native'
import { Button, Divider, IconButton } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { BadgeType, FollowStatus, useMeQuery } from '../../../generated/graphql'

import { UserStackParamList } from '../../../infrastructure/navigation/user.navigator'
import { reshapeBadges } from '../../../utils/helpers'
import { translate } from '../../../utils/translator'

import BadgeItem, {
  MyBadgeType,
} from '../../badges/components/BadgeItem.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import ProfileImage from '../../../components/ProfileImage.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import Error from '../../../components/Error.component'
import EmptyListComponent from '../../../components/EmptyList.component'

type UserProfileScreenProps = {
  route: RouteProp<UserStackParamList, 'UserProfile'>
  navigation: NavigationProp<UserStackParamList>
}

const createReshapedBadgeKey = (items: BadgeType[], index: number) =>
  `${items[0].id}${items[1]?.id}${index}`

const UserProfileScreen = ({ navigation }: UserProfileScreenProps) => {
  const { data, loading, error } = useMeQuery()
  const theme = useTheme()
  const [countOfBadges, setCountOfBadges] = useState(0)

  const countOfFriends = useMemo(
    () =>
      data?.me.friends.filter((f) => f.status === FollowStatus.Accepted)
        .length || 0,
    [data?.me.friends]
  )
  const countOfFollowers = useMemo(
    () =>
      data?.me.followers.filter((f) => f.status === FollowStatus.Accepted)
        .length || 0,
    [data?.me.followers]
  )

  // ?: does not update UI properly
  // const friendsLength = data?.me.friendsCount
  // const followersLength = data?.me.followersCount

  // !: temp
  const allReshapedBadges = useMemo(() => {
    const created = data?.me.badgeTypesCreated || []
    const owned = data?.me.badgeItemsOwned.map((item) => item.badgeType) || []

    const allBadges = [...created, ...owned]

    setCountOfBadges(allBadges.length)
    return reshapeBadges<MyBadgeType>(allBadges)
  }, [data?.me.badgeTypesCreated, data?.me.badgeItemsOwned])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="share" // todo: find a proper icon
          color={theme.colors.text.primary}
          onPress={onOpenShare}
        />
      ),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    })
  }, [navigation, theme])

  // todo: make me dyanimc asap deeplink is ready
  const onOpenShare = () =>
    Share.share({
      message: 'Check out my Showcase: https://showcase.to/example',
      url: 'https://showcase.to/example',
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        err && console.log(err)
      })

  if (loading) {
    return <LoadingIndicator fullScreen />
  } else if (data) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg.primary }}>
        <View style={{ alignItems: 'center' }}>
          <Spacer position="y" size="large">
            <ProfileImage source={data.me.profile?.avatarUrl} />
          </Spacer>
          <Spacer position="bottom" size="large">
            <Text>{data.me.profile?.displayName}</Text>
          </Spacer>

          <View flexDirection="row">
            <Pressable
              onPress={() =>
                navigation.navigate('UserFriends', {
                  userFollowingCount: countOfFriends,
                })
              }
            >
              <View alignItems="center" style={{ paddingHorizontal: 12 }}>
                <Text>{countOfFriends}</Text>
                <Spacer />
                <Text variant="caption">
                  {translate().profileCountFollowing}
                </Text>
              </View>
            </Pressable>

            <Divider style={{ width: 1, height: '60%' }} />

            <Pressable
              onPress={() =>
                navigation.navigate('UserFollowers', {
                  userFollowersCount: countOfFollowers,
                })
              }
            >
              <View alignItems="center" style={{ paddingHorizontal: 12 }}>
                <Text>{countOfFollowers}</Text>
                <Spacer />
                <Text variant="caption">
                  {translate().profileCountFollowers}
                </Text>
              </View>
            </Pressable>

            <Divider style={{ width: 1, height: '60%' }} />

            <View alignItems="center" style={{ paddingHorizontal: 12 }}>
              <Text>{countOfBadges}</Text>
              <Spacer />
              <Text variant="caption">{translate().profileCountBadges}</Text>
            </View>
          </View>
          <Spacer size="large" />
          <Button
            mode="contained"
            color={theme.colors.ui.accent}
            onPress={() =>
              navigation.navigate('EditUserProfile', {
                user: data.me,
              })
            }
            style={{ borderRadius: 30 }}
            contentStyle={{ paddingHorizontal: 5 }}
            uppercase={false}
          >
            {translate().profileEditButton}
          </Button>
          <Spacer position="all" size="large">
            <View style={{ paddingHorizontal: 20 }}>
              <Text variant="hint" style={{ textAlign: 'center' }}>
                {data.me.profile?.bio}
              </Text>
            </View>
          </Spacer>
        </View>
        <View style={{ flexGrow: 1, width: '100%' }}>
          <FlatList
            horizontal
            data={allReshapedBadges}
            keyExtractor={createReshapedBadgeKey}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
            ListEmptyComponent={<EmptyListComponent text="No Badges yet." />}
            renderItem={({ item: itemArr }) => (
              <View>
                {itemArr.map((item) => (
                  <BadgeItem
                    item={item}
                    key={item.id}
                    withoutInfo
                    onPress={() =>
                      navigation.navigate('BadgeNavigator', {
                        screen: 'BadgeDetails',
                        params: { item },
                      })
                    }
                  />
                ))}
              </View>
            )}
          />
        </View>
      </View>
    )
  } else if (error) {
    return <Error error={error} />
  }
}

export default UserProfileScreen
