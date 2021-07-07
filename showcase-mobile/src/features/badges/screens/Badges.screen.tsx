import { NavigationProp } from '@react-navigation/core'
import React, { useState } from 'react'
import { Button, FlatList, View } from 'react-native'
import EmptyListComponent from '../../../components/EmptyList.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'

import { Spacer } from '../../../components/Spacer.component'
import {
  Category,
  usePaginatedBadgeTypesQuery,
} from '../../../generated/graphql'
import { BadgeStackParamList } from '../../../infrastructure/navigation/badges.navigator'
import BadgeItem from '../components/BadgeItem.component'
import CategorySelector from '../components/CategorySelector.component'
import Error from '../../../components/Error.component'
import {
  StyledSafeArea,
  SearchContainer,
  StyledSearchbar,
} from './Badges.styles'

// todo: impl backend search quering
const BadgesScreen = ({
  navigation,
}: {
  navigation: NavigationProp<BadgeStackParamList>
}) => {
  const [category, setCategory] = useState<Category>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { data, error, loading, fetchMore } = usePaginatedBadgeTypesQuery({
    variables: {
      limit: 10,
      category,
      after: '',
    },
  })

  const badges = data?.feedSearch.edges.map((edge) => edge.node)
  const pageInfo = data?.feedSearch.pageInfo

  const handleFetchMore = React.useCallback(() => {
    setIsLoadingMore(true)
    pageInfo?.hasNextPage &&
      fetchMore({
        variables: {
          limit: 10,
          after: pageInfo?.endCursor,
        },
      }).then(() => {
        setIsLoadingMore(false)
      })
  }, [fetchMore, pageInfo?.endCursor, pageInfo?.hasNextPage])

  if (error) {
    return <Error error={error} />
  }

  return data ? (
    <StyledSafeArea>
      <SearchContainer>
        <StyledSearchbar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Showcase"
          clearButtonMode="unless-editing"
        />
      </SearchContainer>
      <Spacer position="y" size="small">
        <CategorySelector onSelect={setCategory} activeCategory={category} />
      </Spacer>
      <Button onPress={handleFetchMore} title="Moa!" />
      <View style={{ flex: 1 }}>
        {loading ? (
          <LoadingIndicator fullScreen />
        ) : (
          <FlatList
            data={badges}
            keyExtractor={({ id }) => id}
            numColumns={2}
            ListEmptyComponent={EmptyListComponent}
            refreshing={isLoadingMore}
            onEndReached={handleFetchMore}
            onEndReachedThreshold={0.2}
            renderItem={({ item }) => (
              <BadgeItem
                item={item}
                onPress={() => navigation.navigate('BadgeDetails', { item })}
                withoutInfo
              />
            )}
          />
        )}
      </View>
    </StyledSafeArea>
  ) : null
}

export default BadgesScreen
