import React from 'react'
import { View } from 'react-native'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { PickedProfileProps } from '../screens/FindFriend.screen'
import { StyledSurface, StyledImage } from './ChatListItem.component'
import { getImageSource } from '../../../utils/helpers'

const FindFriendItem = ({
  item,
  onPress,
}: {
  item: PickedProfileProps
  onPress: () => void
}) => {
  return (
    <StyledSurface>
      <TouchableOpacity onPress={onPress}>
        <View flexDirection="row">
          <Spacer position="all">
            <StyledImage
              resizeMode="contain"
              source={getImageSource(item.avatar)}
            />
          </Spacer>
          <Spacer position="right" size="medium" />
          <View justifyContent="space-evenly" style={{ flex: 1 }}>
            <Text bold>{item.username}</Text>
            {item.creator && <Text color="grey">creator</Text>}
            <Text color="grey" ellipsizeMode="tail" numberOfLines={1}>
              {item.email}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </StyledSurface>
  )
}

export default FindFriendItem
