import React from 'react'
import { FlatList } from 'react-native'

import { useMeQuery } from '../../../generated/graphql'

import EmptyListComponent from '../../../components/EmptyList.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import CreationItem from '../components/CreationItem.component'
import Error from '../../../components/Error.component'

const Creations = () => {
  const { data, loading, error } = useMeQuery()

  if (loading) {
    return <LoadingIndicator fullScreen />
  } else if (data) {
    return (
      <FlatList
        data={data.me.badgeTypesCreated}
        keyExtractor={(type) => type.id}
        numColumns={1}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyListComponent text={'You have not created a badge yet.'} />
        }
        renderItem={({ item }) => <CreationItem item={item} />}
      />
    )
  } else {
    return <Error error={error} />
  }
}

export default Creations
