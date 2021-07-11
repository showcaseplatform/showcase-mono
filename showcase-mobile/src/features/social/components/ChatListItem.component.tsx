import React from 'react'
import styled from 'styled-components/native'
import { View } from 'react-native'
import { Surface } from 'react-native-paper'

import { getImageSource, makeDateDistanceTag } from '../../../utils/helpers'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { UserChatTransformed } from '../../../../types/chat'

export const StyledImage = styled.Image`
  height: 100%;
  width: undefined;
  aspect-ratio: ${1 / 1};
  border-radius: 30px;
`

export const StyledSurface = styled(Surface)`
  height: 80px;
  margin-horizontal: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[1]};
  elevation: 1;
`

const ChatListItem = ({
  item,
  onPress,
}: {
  item: UserChatTransformed
  onPress: () => void
}) => {
  return (
    <StyledSurface>
      <TouchableOpacity onPress={onPress}>
        <View flexDirection="row">
          <Spacer position="all">
            <StyledImage resizeMode="contain" source={getImageSource()} />
          </Spacer>
          <Spacer position="right" size="medium" />
          <View justifyContent="space-evenly" style={{ flex: 1 }}>
            <Text bold>{item.username}</Text>
            <Text color="grey" ellipsizeMode="tail" numberOfLines={1}>
              {item.lastMessage}
            </Text>
            <Text color="grey">
              {makeDateDistanceTag(item.lastMessageDate._seconds)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </StyledSurface>
  )
}

export default ChatListItem
