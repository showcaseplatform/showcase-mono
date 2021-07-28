import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import { Divider, Surface } from 'react-native-paper'
import { useNavigation, NavigationProp } from '@react-navigation/native'

import { makeDateDistanceTag, makePriceTag } from '../../../utils/helpers'
import { TradeStackParamList } from '../../../infrastructure/navigation/trade.navigator'

import ProfileImage from '../../../components/ProfileImage.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import {
  BadgeItem,
  BadgeType_WithBasicsFragment,
  Maybe,
  Profile,
} from '../../../generated/graphql'

// todo: create proper Fragments to avoid this mess
type SellingItemProps = { __typename?: 'BadgeItem' } & Pick<
  BadgeItem,
  'id' | 'edition' | 'salePrice' | 'saleCurrency' | 'sellDate'
> & {
    badgeType: { __typename?: 'BadgeType' } & {
      creator: { __typename?: 'User' } & {
        profile?: Maybe<
          { __typename?: 'Profile' } & Pick<Profile, 'id' | 'displayName'>
        >
      }
    } & BadgeType_WithBasicsFragment
  }

const SellingItem = ({ item }: { item: SellingItemProps }) => {
  const navigation = useNavigation<NavigationProp<TradeStackParamList>>()
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('TradeBadgeDetails', { item: item.badgeType })
      }
    >
      <Surface>
        <View
          flexDirection="row"
          style={{
            width: '100%',
            paddingHorizontal: 10, //theme.space[2]
            paddingVertical: 12,
          }}
        >
          <ProfileImage source={item.badgeType.publicUrl} small />
          <Spacer position="right" size="large" />
          <View justifyContent="space-evenly" style={{ flexGrow: 1 }}>
            <Text>{item.badgeType.title}</Text>
            <Text variant="caption" color="grey">
              On marketplace{' '}
              <Text variant="caption">
                {makeDateDistanceTag(new Date(item.sellDate))}
              </Text>{' '}
              for{' '}
              <Text variant="caption">
                {makePriceTag(item.salePrice, item.saleCurrency)}
              </Text>
            </Text>
            <Text variant="caption" color="grey">
              created by:{' '}
              <Text variant="caption">
                {item.badgeType.creator.profile?.displayName}
              </Text>
            </Text>
          </View>
        </View>
        <Divider />
      </Surface>
    </TouchableOpacity>
  )
}

export default SellingItem
