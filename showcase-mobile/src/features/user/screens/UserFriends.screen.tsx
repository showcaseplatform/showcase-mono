import React from 'react'
import { View, FlatList } from 'react-native'
import { Surface } from 'react-native-paper'
import { useTheme } from 'styled-components'

import { CenterView } from '../../../components/CenterView.component'
import FollowButton from '../../../components/FollowButton.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import ProfileImage from '../components/ProfileImage.component'

import {
  FollowStatus,
  MeDocument,
  useMeQuery,
  User,
  useToggleFollowMutation,
} from '../../../generated/graphql'
import EmptyListForProfile from '../../badges/components/EmptyListForProfile'

type FollowItemProps = {
  userId: string
  user: User
}

const FollowItem = ({ userId, user }: FollowItemProps) => {
  const { amIFollowing } = user
  const { avatar, username, displayName } = user.profile
  const [toggleFollow, { loading: loadingToggle }] = useToggleFollowMutation({
    refetchQueries: [{ query: MeDocument }],
  })
  const theme = useTheme()

  return (
    <Surface
      flexDirection="row"
      style={{
        backgroundColor: theme.colors.bg.primary,
        paddingHorizontal: 10, //theme.space[2]
        paddingVertical: 12,
      }}
    >
      <ProfileImage source={avatar as string | undefined} small />
      <Spacer position="right" size="large" />
      <View flexGrow={1} justifyContent="space-evenly">
        <Text>{displayName}</Text>
        <Text variant="caption" color="grey">{`@${username}`}</Text>
      </View>
      <CenterView>
        <FollowButton
          isFollowed={amIFollowing}
          onPress={() => toggleFollow({ variables: { userId } })}
          disabled={loadingToggle}
        />
      </CenterView>
    </Surface>
  )
}

const UserFriendsScreen = () => {
  const { data, loading } = useMeQuery()

  if (loading) {
    return <LoadingIndicator fullScreen />
  }

  const acceptedFriends = data?.me.friends.filter(
    (f) => f.status === FollowStatus.Accepted
  )

  return (
    <FlatList
      data={acceptedFriends}
      keyExtractor={(friend) => friend.userId}
      renderItem={({ item: friend }) => <FollowItem {...friend} />}
      ListEmptyComponent={<EmptyListForProfile />}
    />
  )
}

export default UserFriendsScreen
