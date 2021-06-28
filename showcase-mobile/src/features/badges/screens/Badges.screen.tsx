import { NavigationProp } from '@react-navigation/core'
import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import EmptyListComponent from '../../../components/EmptyList.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'

import { Spacer } from '../../../components/Spacer.component'
import { Category, useBadgeTypesQuery } from '../../../generated/graphql'
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
// todo: proper error handling
const BadgesScreen = ({
  navigation,
}: {
  navigation: NavigationProp<BadgeStackParamList>
}) => {
  const [category, setCategory] = useState<Category>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [badgesResult] = useBadgeTypesQuery({
    variables: { category },
  })
  const { data, fetching, error } = badgesResult

  if (error) {
    return <Error />
  }

  return (
    <StyledSafeArea>
      <SearchContainer>
        <StyledSearchbar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Showcase"
          clearButtonMode="unless-editing"
        />
      </SearchContainer>
      <Spacer position="y" size="medium">
        <CategorySelector onSelect={setCategory} />
      </Spacer>
      <View flexGrow={1}>
        {fetching ? (
          <LoadingIndicator fullScreen />
        ) : (
          <FlatList
            data={data?.badgeTypes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={EmptyListComponent}
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
  )
}

export default BadgesScreen
