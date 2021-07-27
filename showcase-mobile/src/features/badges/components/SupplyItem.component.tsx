import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Button, Divider } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { User, BadgeItem, Profile } from '../../../generated/graphql'

import { CenterView } from '../../../components/CenterView.component'
import ProfileImage from '../../../components/ProfileImage.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { makePriceTag } from '../../../utils/helpers'
import { translate } from '../../../utils/translator'

type SupplyItemProps = {
  badge: Pick<
    BadgeItem,
    'id' | 'salePrice' | 'saleCurrency' | 'isSold' | 'forSale'
  > & {
    owner: Pick<User, 'id' | 'userType'> & {
      profile: Pick<Profile, 'displayName' | 'avatarUrl'>
    }
  }
  onPress: () => void
}

const SupplyItem = ({ badge, onPress }: SupplyItemProps) => {
  const { displayName, avatarUrl } = badge.owner.profile
  const { salePrice, saleCurrency, forSale } = badge
  const theme = useTheme()

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          flexDirection="row"
          style={{
            width: '100%',
            paddingHorizontal: 10, //theme.space[2]
            paddingVertical: 12,
          }}
        >
          <ProfileImage source={avatarUrl as string | undefined} small />
          <Spacer position="right" size="large" />
          <View justifyContent="space-evenly" style={{ flexGrow: 1 }}>
            <Text variant="caption" color="grey">
              @{badge.owner.userType}
            </Text>
            <Text variant="caption" color={forSale ? 'primary' : 'grey'}>
              {displayName}
            </Text>
            <Text color={forSale ? 'primary' : 'grey'}>
              {forSale ? 'Selling' : 'In collection'}
            </Text>
          </View>

          {forSale && (
            <>
              <CenterView style={{ flexGrow: 2 }}>
                <Text>{makePriceTag(salePrice, saleCurrency)}</Text>
              </CenterView>
              <CenterView style={{ flexGrow: 1 }}>
                <Button
                  mode="outlined"
                  color={theme.colors.ui.accent}
                  onPress={() => {}}
                  style={{ borderRadius: 30 }}
                  contentStyle={{ paddingHorizontal: 8 }}
                  uppercase
                >
                  <Text color="accent">{translate().purchaseButton}</Text>
                </Button>
              </CenterView>
            </>
          )}
        </View>
      </TouchableOpacity>
      <Divider />
    </>
  )
}

export default SupplyItem
