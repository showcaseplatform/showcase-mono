import React from 'react'
import { useMemo } from 'react'
import { SectionList } from 'react-native'

import { groupBadgesByDateDistance } from '../../../utils/helpers'

import LoadingIndicator from '../../../components/LoadingIndicator.component'
import { BadgeHistoryItem } from '../components/BadgeHistoryItem.component'
import { BadgeHistorySectionHeader } from '../components/BadgeHistorySectionHeader.component'
import { useBadgeTypesQuery } from '../../../generated/graphql'

const BadgeHistory = () => {
  const [{ data: badges, fetching }] = useBadgeTypesQuery()

  const groupedBadges = useMemo(
    () => groupBadgesByDateDistance(badges),
    [badges]
  )

  if (fetching) {
    return <LoadingIndicator fullScreen />
  }

  return (
    <SectionList
      sections={groupedBadges}
      keyExtractor={(item) => item.createdAt} // todo: fix me
      renderItem={({ item }) => <BadgeHistoryItem {...item} />}
      renderSectionHeader={({ section: { title } }) => (
        <BadgeHistorySectionHeader title={title} />
      )}
    />
  )
}

export default BadgeHistory
