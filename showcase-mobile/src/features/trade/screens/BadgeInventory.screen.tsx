import { useNavigation, NavigationProp } from '@react-navigation/native'
import React from 'react'
import { FlatList } from 'react-native'

import EmptyListComponent from '../../../components/EmptyList.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import { TradeStackParamList } from '../../../infrastructure/navigation/trade.navigator'
import { useBadge } from '../../../services/badge/badge.context'
import BadgeItem from '../../badges/components/BadgeItem.component'

const BadgeInventory = () => {
  const navigation = useNavigation<NavigationProp<TradeStackParamList>>()

  const { badges, isLoading } = useBadge()

  if (isLoading) return <LoadingIndicator fullScreen />

  return (
    <FlatList
      data={badges}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={EmptyListComponent}
      renderItem={({ item }) => (
        <BadgeItem
          item={item}
          onPress={() => navigation.navigate('TradeBadgeDetails', { item })}
        />
      )}
    />
  )
}

export default BadgeInventory
