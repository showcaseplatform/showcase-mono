import React from 'react'
import { View } from 'react-native'
import { Button, Divider } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { User, Profile, BadgeType } from '../../../generated/graphql'

import { CenterView } from '../../../components/CenterView.component'
import ProfileImage from '../../../components/ProfileImage.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { makePriceTag } from '../../../utils/helpers'
import { translate } from '../../../utils/translator'

type SupplyItemProps = {
  data: {
    badge: Pick<
      BadgeType,
      | 'id'
      | 'creatorId'
      | 'isSoldOut'
      | 'supply'
      | 'sold'
      | 'price'
      | 'currency'
    >
    creator: Pick<User, 'id' | 'userType'> & {
      profile: Pick<Profile, 'displayName' | 'avatarUrl'>
    }
  }
  onPress: () => void
}

const CreatorSupplyItem = ({ data, onPress }: SupplyItemProps) => {
  const { displayName, avatarUrl } = data.creator.profile
  const { price, currency } = data.badge
  const theme = useTheme()

  return (
    <>
      <View
        flexDirection="row"
        style={{
          width: '100%',
          paddingHorizontal: 10, //theme.space[2]
          paddingVertical: 12,
        }}
      >
        <ProfileImage
          source={avatarUrl as string | undefined}
          small
          onPress={onPress}
        />

        <Spacer position="right" size="large" />
        <View justifyContent="space-evenly" style={{ flexGrow: 1 }}>
          <Text variant="caption" color="grey">
            @{data.creator.userType}
          </Text>
          <Text>{displayName}</Text>
          <Text variant="caption">
            Selling {data.badge.supply - data.badge.sold} from{' '}
            {data.badge.supply} pcs
          </Text>
        </View>

        <CenterView style={{ flexGrow: 2 }}>
          <Text>{makePriceTag(price, currency)}</Text>
        </CenterView>
        <CenterView style={{ flexGrow: 1 }}>
          <Button
            mode="outlined"
            color={theme.colors.ui.accent}
            onPress={() => {}}
            style={{ borderRadius: 30 }}
            contentStyle={{ paddingHorizontal: 8 }}
            uppercase
          >
            <Text color="accent">{translate().purchaseButton}</Text>
          </Button>
        </CenterView>
      </View>
      <Divider />
    </>
  )
}

export default CreatorSupplyItem
