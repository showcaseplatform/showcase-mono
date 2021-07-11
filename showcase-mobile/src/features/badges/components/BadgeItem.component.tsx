import React, { useState } from 'react'
import { Pressable } from 'react-native'

import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { BadgeType } from '../../../generated/graphql'
import { makePriceTag, makeSupplyTag } from '../../../utils/helpers'
import { Badge, BadgeImage, BadgeLabelWrapper } from './BadgeItem.styles'

export type BadgeItemProps = {
  item: MyBadgeType
  withoutInfo?: boolean
  flat?: boolean
  onPress: () => void
}

// todo: extract me
export type MyBadgeType = Pick<
  BadgeType,
  'publicUrl' | 'price' | 'currency' | 'supply' | 'sold' | 'createdAt'
>

export type Cause = {
  causesImgUrl?: string
  donationCauseName?: string
  viewDonationSite?: string
  donationAmount?: number
}

const BadgeItem = (props: BadgeItemProps) => {
  const { item, onPress, withoutInfo = false, flat = false } = props
  const { price = 0, currency, supply, sold, publicUrl } = item
  const [imgLoaded, setLoaded] = useState(false)

  return (
    <Badge flat={flat}>
      <Pressable onPress={onPress}>
        {publicUrl && (
          <BadgeImage
            source={{ uri: publicUrl }}
            onLoadEnd={() => setLoaded(true)}
          />
        )}
        {imgLoaded && !withoutInfo && (
          <BadgeLabelWrapper>
            <Spacer position="all" size="medium">
              <Text color="secondary" style={{ alignSelf: 'flex-end' }}>
                {makeSupplyTag(sold, supply)}
              </Text>
            </Spacer>

            <Spacer position="all" size="medium">
              <Text color="secondary">{makePriceTag(price, currency)}</Text>
            </Spacer>
          </BadgeLabelWrapper>
        )}
      </Pressable>
    </Badge>
  )
}

export default BadgeItem
