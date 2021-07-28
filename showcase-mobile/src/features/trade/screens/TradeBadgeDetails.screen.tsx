import React, { useRef, useState, ComponentType } from 'react'
import { View, Image, LayoutAnimation, Alert } from 'react-native'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { Button, List, Surface } from 'react-native-paper'
import styled, { useTheme } from 'styled-components'
import { Ionicons } from '@expo/vector-icons'

import { Spacer } from '../../../components/Spacer.component'
import { Text } from '../../../components/Text.component'
import { TradeStackParamList } from '../../../infrastructure/navigation/trade.navigator'
import { makeDonationTag, makePriceTag } from '../../../utils/helpers'
import { ScrollView } from 'react-native-gesture-handler'
import { useBadgeDetailsQuery } from '../../../generated/graphql'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import Error from '../../../components/Error.component'

type TradeBadgeDetailsScreenProps = {
  route: RouteProp<TradeStackParamList, 'TradeBadgeDetails'>
  navigation: NavigationProp<TradeStackParamList>
}
type AccordionStateProps = string | number | undefined

const StyledAccordionItem = styled(List.Item)`
  /* padding-vertical: 0; */
`

// todo: temp on sale / in inventory cuz dataset does not identify obviously
const TradeBadgeDetailsScreen = ({ route }: TradeBadgeDetailsScreenProps) => {
  const { item } = route.params

  const { data, loading, error } = useBadgeDetailsQuery({
    variables: { id: route.params.item.id },
  })

  const { price, currency, supply = 11, sold = 4 } = item

  const theme = useTheme()

  const [expandedAccordion, setExpandedAccordion] =
    useState<AccordionStateProps>(undefined)

  let scrollRef = useRef<ComponentType<any> | null>(null) // todo: TS FIX ME

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
    const { viewCount, likeCount, donationAmount } = data.badgeType
    const { profile } = data.badgeType.creator

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
            <Text variant="heading">{item.title}</Text>
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
              </View>
              <Spacer position="x" size="medium" />
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
                mode={price ? 'outlined' : 'contained'}
                color={theme.colors.ui.accent}
                onPress={() => Alert.alert(`${item.id}`)}
              >
                {price ? 'Cancel Sale' : 'Sell Badge'}
              </Button>
            </Spacer>
          </Surface>

          <List.AccordionGroup
            onAccordionPress={handleOpenAcc}
            expandedId={expandedAccordion}
          >
            <Surface>
              <List.Accordion
                title="Details"
                id={1}
                style={{ padding: 5 }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title={<Text>{`Created by: ${profile.displayName}`}</Text>}
                />
                <StyledAccordionItem
                  title={`Released: ${supply} pcs`}
                  description="total count of created badges"
                />
                <StyledAccordionItem
                  title={`Remaining: ${supply - sold} pcs`}
                  description="number of available badges"
                />
              </List.Accordion>
            </Surface>
            <Surface>
              <List.Accordion
                title={`Donation (${makeDonationTag(donationAmount)}) `}
                id={2}
                style={{ padding: 5 }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title={
                    <Text>{`Cause: ${data?.badgeType?.cause?.name}`}</Text>
                  }
                  description={
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt reiciendis vel earum ducimus provident quidem, debitis deleniti nostrum quos vero labore doloremque quae modi accusantium.'
                  }
                />
                {data?.badgeType?.cause?.site && (
                  <StyledAccordionItem
                    title={
                      <Text variant="link">{data.badgeType.cause.site}</Text>
                    }
                  />
                )}
              </List.Accordion>
            </Surface>
            <Surface>
              <List.Accordion
                title="Trademark"
                id={3}
                style={{ padding: 5 }}
                theme={{ colors: { primary: theme.colors.text.grey } }}
              >
                <StyledAccordionItem
                  title=""
                  titleNumberOfLines={0}
                  titleStyle={{ display: 'none' }}
                  descriptionNumberOfLines={99}
                  description={
                    <Text>
                      it is really up to you. A tattoo on your forehead would be
                      the best place for it. Please dont't forget to post a
                      properfly over-effected insta pic as well to share this
                      perfect idea... {'\n'}
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Consectetur accusamus hic eveniet labore, deserunt
                      adipisci corporis id eius nesciunt repudiandae.
                    </Text>
                  }
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
