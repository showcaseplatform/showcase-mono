// import * as yup from 'yup'
import React from 'react'
import { View, Image } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Button, Divider, List, Surface } from 'react-native-paper'
import styled, { useTheme } from 'styled-components'
import { Ionicons } from '@expo/vector-icons'

import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { TradeStackParamList } from '../../../infrastructure/navigation/trade.navigator'
import { makePriceTag } from '../../../utils/helpers'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Currency,
  useBadgeDetailsQuery,
  useMyItemQuery,
} from '../../../generated/graphql'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import Error from '../../../components/Error.component'
import { format } from 'date-fns'
import ProfileImage from '../../../components/ProfileImage.component'
import { useMyDialog } from '../../../utils/useMyDialog'
import useAccordion from '../../../hooks/useAccordion'
import ConfirmListForSale from '../components/ConfirmListForSale.component'
import ConfirmUnlistFromSale from '../components/ConfirmUnlistFromSale.component'

type TradeItemDetailsScreenProps = {
  route: RouteProp<TradeStackParamList, 'TradeItemDetails'>
  navigation: NavigationProp<TradeStackParamList>
}

const StyledAccordionItem = styled(List.Item)`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding: 0;
`

const TradeItemDetails = ({ route }: TradeItemDetailsScreenProps) => {
  const { itemId, id } = route.params
  const { openDialog, closeDialog } = useMyDialog()

  const { handleOpenAccordion, scrollRef, currentOpenAccordion } =
    useAccordion()

  const { data, loading, error } = useBadgeDetailsQuery({
    variables: { id },
  })

  const { data: dataItem } = useMyItemQuery({ variables: { id: itemId } })

  // const myItem = data?.badgeType?.badgeItems.find((item) => item.id === itemId)

  const theme = useTheme()

  if (loading) {
    return <LoadingIndicator />
  } else if (data?.badgeType && dataItem?.me.badgeItemsOwned) {
    const {
      viewCount,
      likeCount,
      description,
      badgeItems,
      supply,
      sold,
      createdAt,
      title,
      publicUrl,
      creator,
      availableToBuyCount,
    } = data?.badgeType

    const { id, salePrice, saleCurrency, forSale } =
      dataItem.me.badgeItemsOwned[0]

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
              {forSale && (
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
                    {makePriceTag(
                      salePrice as number | undefined,
                      saleCurrency as Currency | undefined
                    )}
                  </Text>
                  <Spacer position="x" size="medium" />
                </View>
              )}
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

            <Spacer position="top" size="medium">
              <Button
                mode={forSale ? 'outlined' : 'contained'}
                color={theme.colors.ui.accent}
                onPress={() =>
                  forSale
                    ? openDialog(
                        <ConfirmUnlistFromSale
                          badgeItemId={id}
                          onClose={closeDialog}
                        />
                      )
                    : openDialog(
                        <ConfirmListForSale
                          badgeItemId={id}
                          onClose={closeDialog}
                        />
                      )
                }
              >
                {forSale ? 'Cancel Sale' : 'Sell Badge'}
              </Button>
            </Spacer>
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
                <StyledAccordionItem
                  title={`Created by: ${creator.profile?.displayName}`}
                />
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
                title={`Supply ${`(${supply}/${availableToBuyCount})`}`}
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
                {badgeItems.map((badgeItem) => {
                  if (!badgeItem.isOwnedByMe) {
                    return (
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
                    )
                  }
                })}
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
                  description={description}
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

export default TradeItemDetails
