import React from 'react'
import { Alert, View } from 'react-native'
import { Surface } from 'react-native-paper'
import { Text } from '../../../components/Text.component'
import { makePriceTag } from '../../../utils/helpers'
import BadgeItem, { Badge } from '../../badges/components/BadgeItem.component'

export const BadgeHistoryItem = (props: Badge) => (
  <Surface style={{ flexDirection: 'row', elevation: 2 }}>
    <BadgeItem
      item={props}
      onPress={() => Alert.alert(props.id)}
      withoutInfo
      flat
    />
    <View
      style={{
        flex: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        padding: 5,
      }}
    >
      <Text uppercase>{props.name}</Text>
      <Text variant="caption">
        your badge's new owner: 'some username'. {'\n'}sold for{' '}
        {makePriceTag(props.price, props.currency)}
      </Text>
    </View>
  </Surface>
)
