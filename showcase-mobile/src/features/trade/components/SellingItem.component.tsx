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
import { Currency } from '../../../generated/graphql'
import { CollectionItemProps } from './CollectionItem.component'

const SellingItem = ({ item }: { item: CollectionItemProps }) => {
  const navigation = useNavigation<NavigationProp<TradeStackParamList>>()
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('TradeItemDetails', {
          id: item.badgeType.id,
          itemId: item.id,
        })
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
              Listed for sale{' '}
              <Text variant="caption">
                {makeDateDistanceTag(new Date(item.updatedAt))}
              </Text>{' '}
              for{' '}
              <Text variant="caption">
                {makePriceTag(
                  item.salePrice as number | undefined,
                  item.saleCurrency as Currency | undefined
                )}
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
