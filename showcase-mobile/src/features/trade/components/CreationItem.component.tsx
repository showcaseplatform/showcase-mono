import React, { useMemo } from 'react'
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
  BadgeType,
  BadgeType_WithBasicsFragment,
  Maybe,
  Receipt,
} from '../../../generated/graphql'

// todo: create proper Fragments to avoid this mess
export type CreationItemProps = Pick<BadgeType, 'isSoldOut'> & {
  badgeItems: Array<
    Pick<BadgeItem, 'id' | 'createdAt'> & {
      receipt?: Maybe<{ __typename?: 'Receipt' } & Pick<Receipt, 'createdAt'>>
    }
  >
} & BadgeType_WithBasicsFragment

const CreationItem = ({ item }: { item: CreationItemProps }) => {
  const navigation = useNavigation<NavigationProp<TradeStackParamList>>()

  const hasSold = useMemo(
    () => item?.badgeItems?.length > 0,
    [item?.badgeItems?.length]
  )

  // todod: temp
  const lastSoldItem = item.badgeItems.reduce(
    (a, b) => (a.createdAt > b.createdAt ? a : b),
    []
  )

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('TradeTypeDetails', { id: item.id })}
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
          <ProfileImage source={item.publicUrl} small />
          <Spacer position="right" size="large" />
          <View justifyContent="space-evenly" style={{ flexGrow: 1 }}>
            <Text>{item.title}</Text>

            <View flexDirection="row">
              <Text variant="caption" color="grey">
                Created{' '}
              </Text>
              <Text variant="caption">
                {makeDateDistanceTag(new Date(item.createdAt))}{' '}
              </Text>
              {!item.isSoldOut && (
                <>
                  <Text variant="caption" color="grey">
                    selling for{' '}
                  </Text>
                  <Text variant="caption">
                    {makePriceTag(item.price, item.currency)}
                  </Text>
                </>
              )}
            </View>

            <Text variant="caption" color="grey">
              {item.isSoldOut
                ? 'sold out'
                : hasSold
                ? `Last sold: ${makeDateDistanceTag(
                    new Date(lastSoldItem.createdAt)
                  )}, ${item.supply - item.sold} remaining`
                : 'no item sold'}
            </Text>
          </View>
        </View>
        <Divider />
      </Surface>
    </TouchableOpacity>
  )
}

export default CreationItem
