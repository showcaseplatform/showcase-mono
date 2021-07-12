import React, { useState, useCallback } from 'react'
import { NavigationProp } from '@react-navigation/core'
import { FlatList, View, RefreshControl } from 'react-native'
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

const BadgesScreen = ({
  navigation,
}: {
  navigation: NavigationProp<BadgeStackParamList>
}) => {
  const [category, setCategory] = useState<Category>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, error, loading, fetchMore, refetch } =
    usePaginatedBadgeTypesQuery({
      variables: {
        limit: 10,
        after: '',
        category,
        search: searchQuery,
      },
    })

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch({ limit: 10, category, search: searchQuery })
    setIsRefreshing(false)
  }, [category, searchQuery, refetch])

  const handleFetchMore = async () => {
    setIsLoadingMore(true)
    pageInfo?.hasNextPage &&
      (await fetchMore({
        variables: {
          limit: 4,
          after: pageInfo?.endCursor,
          category,
          search: searchQuery,
        },
      }))
    setIsLoadingMore(false)
  }

  // todo: debounce me
  const handleSearchQueryChange = async (val: string) => {
    setSearchQuery(val)
    await refetch({ limit: 10, category, search: val })
  }

  const handleCategoryChange = async (val: Category | undefined) => {
    setCategory(val)
    await refetch({ limit: 10, category: val, search: searchQuery })
  }

  const badges = data?.feedSearch.edges.map((edge) => edge.node)
  const pageInfo = data?.feedSearch.pageInfo

  if (error) {
    return <Error error={error} />
  }

  return data ? (
    <StyledSafeArea>
      <SearchContainer>
        <StyledSearchbar
          value={searchQuery}
          onChangeText={handleSearchQueryChange}
          placeholder="Search Showcase"
          clearButtonMode="unless-editing"
        />
      </SearchContainer>
      <Spacer position="y" size="small">
        <CategorySelector
          onSelect={handleCategoryChange}
          activeCategory={category}
        />
      </Spacer>
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
            onEndReachedThreshold={0.6}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
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
  ) : (
    <LoadingIndicator />
  )
}

export default BadgesScreen
