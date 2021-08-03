import React from 'react'
import { FlatList } from 'react-native'

import EmptyListComponent from '../../../components/EmptyList.component'
import Error from '../../../components/Error.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'

import { useMeQuery } from '../../../generated/graphql'
import CollectionItem from '../components/CollectionItem.component'

const Collection = () => {
  const { data, loading, error } = useMeQuery()

  if (loading) {
    return <LoadingIndicator fullScreen />
  } else if (data) {
    return (
      <FlatList
        data={data.me.badgeItemsToShow}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyListComponent text="You have no badges bought yet" />
        }
        renderItem={({ item }) => <CollectionItem item={item} />}
      />
    )
  } else {
    return <Error error={error} />
  }
}

export default Collection
