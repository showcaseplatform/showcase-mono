import React, { useState, useEffect, useCallback } from 'react'
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

  // !: probably memory leak
  // ?: TEMP solution
  useEffect(() => {
    typeof searchQuery === 'string' && handleRefresh()
  }, [searchQuery, handleRefresh])

  // ?: TEMP solution
  useEffect(() => {
    handleRefresh()
  }, [category, handleRefresh])

  const { data, error, loading, fetchMore, refetch } =
    usePaginatedBadgeTypesQuery({
      variables: {
        limit: 10,
        after: '',
        category,
        search: searchQuery,
      },
    })

  const badges = data?.feedSearch.edges.map((edge) => edge.node)
  const pageInfo = data?.feedSearch.pageInfo

  const handleFetchMore = () => {
    setIsLoadingMore(true)
    pageInfo?.hasNextPage &&
      fetchMore({
        variables: {
          limit: 4,
          after: pageInfo?.endCursor,
          category,
        },
      }).then((_) => {
        setIsLoadingMore(false)
      })
  }

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    refetch({ limit: 10, category, search: searchQuery }).then(() => {
      setIsRefreshing(false)
    })
  }, [category, searchQuery, refetch])

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
        <CategorySelector
          onSelect={(val) => {
            setCategory(val)
            refetch({ limit: 10, category, after: pageInfo?.endCursor })
          }}
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
