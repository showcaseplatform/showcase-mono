import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Surface } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import {
  useToggleFollowMutation,
  MeDocument,
  User,
} from '../../../../generated/graphql'

import { CenterView } from '../../../../components/CenterView.component'
import FollowButton from '../../../../components/FollowButton.component'
import ProfileImage from '../../../../components/ProfileImage.component'
import { Spacer } from '../../../../components/Spacer.component'

type FollowItemProps = {
  user: User
  onPress: () => void
}

const FollowItem = ({ user, onPress }: FollowItemProps) => {
  const { amIFollowing } = user
  const { avatarUrl, username, displayName } = user.profile
  const [toggleFollow, { loading: loadingToggle }] = useToggleFollowMutation({
    refetchQueries: [{ query: MeDocument }],
  })
  const theme = useTheme()

  return (
    <TouchableOpacity onPress={onPress}>
      <Surface
        flexDirection="row"
        style={{
          backgroundColor: theme.colors.bg.primary,
          paddingHorizontal: 10, //theme.space[2]
          paddingVertical: 12,
        }}
      >
        <ProfileImage source={avatarUrl as string | undefined} small />
        <Spacer position="right" size="large" />
        <View flexGrow={1} justifyContent="space-evenly">
          <Text>{displayName}</Text>
          <Text variant="caption" color="grey">{`@${username}`}</Text>
        </View>
        <CenterView>
          <FollowButton
            isFollowed={amIFollowing}
            onPress={() => toggleFollow({ variables: { userId: user.id } })}
            disabled={loadingToggle}
          />
        </CenterView>
      </Surface>
    </TouchableOpacity>
  )
}

export default FollowItem
