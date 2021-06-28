import React from 'react'
import { useMemo } from 'react'
import { SectionList } from 'react-native'

import { useBadge } from '../../../services/badge/badge.context'
import { groupBadgesByDateDistance } from '../../../utils/helpers'

import LoadingIndicator from '../../../components/LoadingIndicator.component'
import { BadgeHistoryItem } from '../components/BadgeHistoryItem.component'
import { BadgeHistorySectionHeader } from '../components/BadgeHistorySectionHeader.component'

const BadgeHistory = () => {
  const { badges, isLoading } = useBadge()

  const groupedBadges = useMemo(() => groupBadgesByDateDistance(badges), [
    badges,
  ])

  if (isLoading) return <LoadingIndicator fullScreen />

  return (
    <SectionList
      sections={groupedBadges}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => <BadgeHistoryItem {...item} />}
      renderSectionHeader={({ section: { title } }) => (
        <BadgeHistorySectionHeader title={title} />
      )}
    />
  )
}

export default BadgeHistory
