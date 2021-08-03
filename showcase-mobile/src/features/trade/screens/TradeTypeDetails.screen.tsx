import React from 'react'
import { View, Image, ScrollView } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Divider, List, Surface } from 'react-native-paper'
import styled, { useTheme } from 'styled-components'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'

import { TradeStackParamList } from '../../../infrastructure/navigation/trade.navigator'
import useAccordion from '../../../hooks/useAccordion'
import { makeDonationTag, makePriceTag } from '../../../utils/helpers'
import { Currency, useBadgeDetailsQuery } from '../../../generated/graphql'

import ProfileImage from '../../../components/ProfileImage.component'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import Error from '../../../components/Error.component'
import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'

type TradeTypeDetailsProps = {
  route: RouteProp<TradeStackParamList, 'TradeTypeDetails'>
  navigation: NavigationProp<TradeStackParamList>
}

const StyledAccordionItem = styled(List.Item)`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding: 0;
`

const TradeTypeDetails = ({ route }: TradeTypeDetailsProps) => {
  const { id } = route.params

  const { data, loading, error } = useBadgeDetailsQuery({
    variables: { id },
  })

  const { currentOpenAccordion, scrollRef, handleOpenAccordion } =
    useAccordion()
  const theme = useTheme()

  if (loading) {
    return <LoadingIndicator />
  } else if (data?.badgeType) {
    const {
      viewCount,
      likeCount,
      donationAmount,
      description,
      badgeItems,
      price,
      currency,
      title,
      createdAt,
      supply,
      sold,
      publicUrl,
      cause,
    } = data?.badgeType
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={(ref) => (scrollRef.current = ref)}
          onContentSizeChange={(_contentWidth, _contentHeight) => {
            scrollRef?.current?.scrollToEnd({ animated: true })
          }}
        >
          <View>
            <Image
              source={{ uri: publicUrl }}
              style={{
                width: '100%',
                aspectRatio: 1 / 1,
              }}
              resizeMode="cover"
            />
          </View>
          <Surface style={{ padding: 10 }}>
            <Text variant="heading">{title}</Text>
            <View flexDirection="row">
              <View
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  size={20}
                  name="cash-outline"
                  color={theme.colors.text.grey}
                />
                <Spacer position="right" />
                <Text variant="label" color="grey">
                  {makePriceTag(price, currency)}
                </Text>
                <Spacer position="x" size="medium" />
              </View>

              <View
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  size={20}
                  name="eye-outline"
                  color={theme.colors.text.grey}
                />
                <Spacer position="right" />
                <Text variant="label" color="grey">
                  {viewCount}
                </Text>
              </View>
              <Spacer position="x" size="medium" />
              <View
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  size={20}
                  name="thumbs-up-outline"
                  color={theme.colors.text.grey}
                />
                <Spacer position="right" />
                <Text variant="label" color="grey">
                  {likeCount}
                </Text>
              </View>
            </View>
          </Surface>

          <List.AccordionGroup
            onAccordionPress={handleOpenAccordion}
            expandedId={currentOpenAccordion}
          >
            <Surface>
              <List.Accordion
                title="Details"
                id={1}
                style={{ padding: 5, backgroundColor: theme.colors.bg.primary }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem title="Created by: You" />
                <StyledAccordionItem
                  title={`Created at: ${format(
                    new Date(createdAt),
                    'MM/dd/yyyy'
                  )}`}
                />
                <StyledAccordionItem
                  title="Description:"
                  description={description}
                  descriptionNumberOfLines={10}
                  style={{ display: description ? undefined : 'none' }}
                />
              </List.Accordion>
            </Surface>

            <Surface>
              <List.Accordion
                title={`Supply (${supply}/${supply - sold})`}
                id={3}
                style={{ padding: 5, backgroundColor: theme.colors.bg.primary }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title={`Remaining: ${supply - sold}`}
                  description="available number of badges from original supply"
                />
                <StyledAccordionItem
                  title={`Released: ${supply}`}
                  description="original supply"
                />
                <Divider />
                <Spacer position="bottom" />
                {badgeItems.map((badgeItem) => (
                  <StyledAccordionItem
                    title={badgeItem.owner.profile?.displayName}
                    description={
                      badgeItem.forSale
                        ? `Selling for ${makePriceTag(
                            badgeItem.salePrice as number | undefined,
                            badgeItem.saleCurrency as Currency | undefined
                          )}`
                        : 'in collection'
                    }
                    left={() => (
                      <ProfileImage
                        source={badgeItem.owner.profile?.avatarUrl}
                        small
                      />
                    )}
                    style={{ marginHorizontal: 5, marginBottom: 5 }}
                    key={badgeItem.id}
                  />
                ))}
              </List.Accordion>
            </Surface>

            <Surface>
              <List.Accordion
                title={`Donation (${makeDonationTag(
                  donationAmount as number | undefined
                )}) `}
                id={2}
                style={{ padding: 5, backgroundColor: theme.colors.bg.primary }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title={`Cause: ${cause?.name}`}
                  left={() => <ProfileImage source={cause?.imageUrl} small />}
                  description={cause?.site}
                />
              </List.Accordion>
            </Surface>

            <Surface>
              <List.Accordion
                title="Trademark"
                id={4}
                style={{ padding: 5, backgroundColor: theme.colors.bg.primary }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title="placeholder"
                  descriptionNumberOfLines={10}
                  description={data.badgeType.description}
                />
              </List.Accordion>
            </Surface>
          </List.AccordionGroup>
        </ScrollView>
      </View>
    )
  } else {
    return <Error error={error} />
  }
}

export default TradeTypeDetails
