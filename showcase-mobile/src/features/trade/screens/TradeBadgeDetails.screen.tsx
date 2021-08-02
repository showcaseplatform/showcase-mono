import React, { useRef, useState, ComponentType } from 'react'
import { View, Image, LayoutAnimation, Alert } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Button, Divider, List, Surface } from 'react-native-paper'
import styled, { useTheme } from 'styled-components'
import { Ionicons } from '@expo/vector-icons'

import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { TradeStackParamList } from '../../../infrastructure/navigation/trade.navigator'
import { makeDonationTag, makePriceTag } from '../../../utils/helpers'
import { ScrollView } from 'react-native-gesture-handler'
import { Currency, useBadgeDetailsQuery } from '../../../generated/graphql'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import Error from '../../../components/Error.component'
import { format } from 'date-fns'
import ProfileImage from '../../../components/ProfileImage.component'

type TradeBadgeDetailsScreenProps = {
  route: RouteProp<TradeStackParamList, 'TradeBadgeDetails'>
  navigation: NavigationProp<TradeStackParamList>
}
type AccordionStateProps = string | number | undefined

const StyledAccordionItem = styled(List.Item)`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding: 0;
`

// ?: different incoming data types
const TradeBadgeDetailsScreen = ({ route }: TradeBadgeDetailsScreenProps) => {
  const { type, item } = route.params

  const { data, loading, error } = useBadgeDetailsQuery({
    variables: { id: item?.badgeType.id || type?.id },
  })

  const theme = useTheme()

  const [expandedAccordion, setExpandedAccordion] =
    useState<AccordionStateProps>(undefined)

  let scrollRef = useRef<ComponentType<any> | null>(null)

  const handleOpenAcc = (expandedId: number | string) => {
    LayoutAnimation.easeInEaseOut()
    if (expandedId === expandedAccordion) {
      setExpandedAccordion(undefined)
    } else {
      setExpandedAccordion(expandedId)
    }
  }

  if (loading) {
    return <LoadingIndicator />
  } else if (data && data.badgeType) {
    const { viewCount, likeCount, donationAmount, isCreatedByMe, description } =
      data.badgeType

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={(ref) => (scrollRef.current = ref)}
          onContentSizeChange={(_contentWidth, _contentHeight) => {
            scrollRef.current.scrollToEnd({ animated: true })
          }}
        >
          <View>
            <Image
              source={{ uri: data?.badgeType?.publicUrl }}
              style={{
                width: '100%',
                aspectRatio: 1 / 1,
              }}
              resizeMode="cover"
            />
          </View>
          <Surface style={{ padding: 10 }}>
            <Text variant="heading">
              {type?.title || item?.badgeType.title}
            </Text>
            <View flexDirection="row">
              {item?.forSale ||
                (type && (
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
                      {type
                        ? makePriceTag(type.price, type.currency)
                        : makePriceTag(
                            item?.salePrice as number | undefined,
                            item?.saleCurrency as Currency | undefined
                          )}
                    </Text>
                    <Spacer position="x" size="medium" />
                  </View>
                ))}
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
            {!isCreatedByMe && (
              <Spacer position="top" size="medium">
                <Button
                  mode={item?.forSale ? 'outlined' : 'contained'}
                  color={theme.colors.ui.accent}
                  onPress={() => Alert.alert(`${item?.id}`)}
                >
                  {item?.forSale ? 'Cancel Sale' : 'Sell Badge'}
                </Button>
              </Spacer>
            )}
          </Surface>

          <List.AccordionGroup
            onAccordionPress={handleOpenAcc}
            expandedId={expandedAccordion}
          >
            <Surface>
              <List.Accordion
                title="Details"
                id={1}
                style={{ padding: 5, backgroundColor: theme.colors.bg.primary }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title={`Created by: ${
                    type ? 'You' : item?.badgeType.creator.profile?.displayName
                  }`}
                />
                <StyledAccordionItem
                  title={`Created at: ${format(
                    new Date(item?.badgeType.createdAt || type?.createdAt),
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
                title={`Supply ${
                  type
                    ? `(${type.supply}/${type.supply - type.sold})`
                    : `(${item?.badgeType.supply}/${item?.badgeType.availableToBuyCount})`
                }`}
                id={3}
                style={{ padding: 5, backgroundColor: theme.colors.bg.primary }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title={`Remaining: ${
                    (type && type.supply - type.sold) ||
                    (item && item?.badgeType.supply - item?.badgeType.sold)
                  }`}
                  description="available number of badges from original supply"
                />
                <StyledAccordionItem
                  title={`Released: ${type?.supply || item?.badgeType.supply}`}
                  description="original supply"
                />
                <Divider />
                <Spacer position="bottom" />
                {data.badgeType.badgeItems.map((fetchedItem) => {
                  if (!fetchedItem.isSold && !fetchedItem.isOwnedByMe) {
                    return (
                      <StyledAccordionItem
                        title={fetchedItem.owner.profile?.displayName}
                        description={
                          fetchedItem.forSale
                            ? `Selling for ${makePriceTag(
                                fetchedItem.salePrice as number | undefined,
                                fetchedItem.saleCurrency as Currency | undefined
                              )}`
                            : 'in collection'
                        }
                        left={() => (
                          <ProfileImage
                            source={fetchedItem.owner.profile?.avatarUrl}
                            small
                          />
                        )}
                        style={{ marginHorizontal: 5, marginBottom: 5 }}
                        key={fetchedItem.id}
                      />
                    )
                  }
                })}
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
                  title={`Cause: ${data?.badgeType?.cause?.name}`}
                  left={() => (
                    <ProfileImage
                      source={data.badgeType?.cause?.imageUrl}
                      small
                    />
                  )}
                  description={data?.badgeType?.cause?.site}
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

export default TradeBadgeDetailsScreen
