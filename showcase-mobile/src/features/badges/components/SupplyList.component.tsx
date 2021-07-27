import React from 'react'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import { useBadgeSupplyQuery } from '../../../generated/graphql'
import { useMyBottomSheet } from '../../../utils/useMyBottomSheet'
import CreatorSupplyItem from './CreatorSupplyItem.component'
import SupplyItem from './SupplyItem.component'
import { BadgeStackParamList } from '../../../infrastructure/navigation/badges.navigator'
import { NavigationProp } from '@react-navigation/native'
import { ScrollView } from 'react-native'
import { BottomSheetWrapper } from '../../../components/ScreenWrapper.component'
import BottomSheetHeader from '../../authentication/components/BottomSheetHeader.component'

// TODO: nested scrollView does not calc height properly cuf of other comps above it.
const SupplyList = ({
  badgeId,
  navigation,
}: {
  badgeId: string
  navigation: NavigationProp<BadgeStackParamList>
}) => {
  const { data } = useBadgeSupplyQuery({ variables: { id: badgeId } })
  const { collapse } = useMyBottomSheet()

  function handleNavigation(id: string) {
    collapse()
    navigation.navigate('Profile', { userId: id })
  }

  if (!data) {
    return <LoadingIndicator />
  } else if (data.badgeType) {
    const sortedList = [...data?.badgeType?.badgeItems].sort(
      (a, b) => Number(b.forSale) - Number(a.forSale)
    )

    return (
      <BottomSheetWrapper>
        <BottomSheetHeader
          title="Current Supply"
          subtitle="Who do you want to buy from?"
        />
        <CreatorSupplyItem
          data={{
            creator: data.badgeType.creator,
            badge: data.badgeType,
          }}
          onPress={() =>
            data.badgeType?.creatorId &&
            handleNavigation(data.badgeType?.creatorId)
          }
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            height: '100%',
          }}
        >
          {sortedList.map((item) => (
            <SupplyItem
              badge={item}
              onPress={() => handleNavigation(item.owner.id)}
              key={item.id}
            />
          ))}
        </ScrollView>
      </BottomSheetWrapper>
    )
  } else {
    return null
  }
}

export default SupplyList
