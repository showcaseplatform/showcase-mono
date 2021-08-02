import {
  ResolversEnhanceMap,
  applyResolversEnhanceMap,
  applyModelsEnhanceMap,
  applyRelationResolversEnhanceMap,
  FindUniqueUserResolver,
  FindFirstUserResolver,
  FindManyUserResolver,
  AggregateUserResolver,
  GroupByUserResolver,
  UserRelationsResolver,
  FindUniqueProfileResolver,
  FindFirstProfileResolver,
  FindManyProfileResolver,
  AggregateProfileResolver,
  GroupByProfileResolver,
  ProfileRelationsResolver,
  FindFirstBadgeTypeResolver,
  FindManyBadgeTypeResolver,
  AggregateBadgeTypeResolver,
  GroupByBadgeTypeResolver,
  BadgeTypeRelationsResolver,
  FindUniqueBadgeTypeResolver,
  FindUniqueCauseResolver,
  FindFirstCauseResolver,
  FindManyCauseResolver,
  AggregateCauseResolver,
  GroupByCauseResolver,
  CauseRelationsResolver,
  FindUniqueCurrencyRateResolver,
  FindFirstCurrencyRateResolver,
  FindManyCurrencyRateResolver,
  AggregateCurrencyRateResolver,
  GroupByCurrencyRateResolver,
  FollowRelationsResolver,
  BadgeItemRelationsResolver,
} from '@generated/type-graphql'
import {
  IsBadgeItemOwnedOrCreatedByCurrentUser,
  IsCurrentUser,
} from '../libs/auth/decorators'

const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    // publicly available with restrictions on properties
  },
  Profile: {
    // publicly available with restrictions on properties
  },
  BadgeType: {
    // publicly available with restrictions on properties
  },
  Cause: {
    // publicly available
  },
  CurrencyRate: {
    // publicly available
  },
}

applyResolversEnhanceMap(resolversEnhanceMap)

applyModelsEnhanceMap({
  User: {
    fields: {
      phone: [IsCurrentUser() as PropertyDecorator],
    },
  },
  Profile: {
    fields: {
      email: [IsCurrentUser() as PropertyDecorator],
    },
  },
})

applyRelationResolversEnhanceMap({
  User: {
    balance: [
      IsCurrentUser(null) as PropertyDecorator,
    ],
    cryptoWallet: [IsCurrentUser(null) as PropertyDecorator],
    transferwise: [IsCurrentUser(null) as PropertyDecorator],
    withdrawals: [IsCurrentUser([]) as PropertyDecorator],
    paymentInfo: [IsCurrentUser(null) as PropertyDecorator],
    buyReceipts: [IsCurrentUser([]) as PropertyDecorator],
    sellReceipts: [IsCurrentUser([]) as PropertyDecorator],
    notifications: [IsCurrentUser([]) as PropertyDecorator],
    notificationSettings: [IsCurrentUser([]) as PropertyDecorator],
    chats: [IsCurrentUser([]) as PropertyDecorator],
    sentChatMessages: [IsCurrentUser([]) as PropertyDecorator],
    chatMessageReads: [IsCurrentUser([]) as PropertyDecorator],
    friends: [IsCurrentUser([]) as PropertyDecorator],
    followers: [IsCurrentUser([]) as PropertyDecorator],
  },
  BadgeItem: {
    receipts: [IsBadgeItemOwnedOrCreatedByCurrentUser(null) as PropertyDecorator],
  },
})

const userResolvers = [
  FindUniqueUserResolver,
  FindFirstUserResolver,
  FindManyUserResolver,
  AggregateUserResolver,
  GroupByUserResolver,
  UserRelationsResolver,
]
const profileResolvers = [
  FindUniqueProfileResolver,
  FindFirstProfileResolver,
  FindManyProfileResolver,
  AggregateProfileResolver,
  GroupByProfileResolver,
  ProfileRelationsResolver,
]

const badgeTypeResolvers = [
  FindFirstBadgeTypeResolver,
  FindManyBadgeTypeResolver,
  AggregateBadgeTypeResolver,
  GroupByBadgeTypeResolver,
  BadgeTypeRelationsResolver,
  FindUniqueBadgeTypeResolver,
]

const badgeItemResolvers = [BadgeItemRelationsResolver]

const causeResolvers = [
  FindUniqueCauseResolver,
  FindFirstCauseResolver,
  FindManyCauseResolver,
  AggregateCauseResolver,
  GroupByCauseResolver,
  CauseRelationsResolver,
]

const currencyRateResolvers = [
  FindUniqueCurrencyRateResolver,
  FindFirstCurrencyRateResolver,
  FindManyCurrencyRateResolver,
  AggregateCurrencyRateResolver,
  GroupByCurrencyRateResolver,
]

const followResolvers = [FollowRelationsResolver]

export const generatedResolvers = [
  ...userResolvers,
  ...profileResolvers,
  ...badgeTypeResolvers,
  ...badgeItemResolvers,
  ...causeResolvers,
  ...currencyRateResolvers,
  ...followResolvers,
]
