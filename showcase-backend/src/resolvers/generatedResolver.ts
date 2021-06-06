import { Authorized } from 'type-graphql'

import {
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
  ResolversEnhanceMap,
  applyResolversEnhanceMap,
  FindFirstBadgeTypeResolver,
  FindManyBadgeTypeResolver,
  AggregateBadgeTypeResolver,
  GroupByBadgeTypeResolver,
  BadgeTypeRelationsResolver,
  FindUniqueBadgeTypeResolver,
  FindUniqueBadgeItemResolver,
  FindFirstBadgeItemResolver,
  FindManyBadgeItemResolver,
  AggregateBadgeItemResolver,
  GroupByBadgeItemResolver,
  BadgeItemRelationsResolver,
  FindUniqueCauseResolver,
  FindFirstCauseResolver,
  FindManyCauseResolver,
  AggregateCauseResolver,
  GroupByCauseResolver,
  CauseRelationsResolver,
  FindUniqueStripeResolver,
  FindFirstStripeResolver,
  FindManyStripeResolver,
  AggregateStripeResolver,
  GroupByStripeResolver,
  StripeRelationsResolver,
  FindUniqueBalanceResolver,
  FindFirstBalanceResolver,
  FindManyBalanceResolver,
  AggregateBalanceResolver,
  GroupByBalanceResolver,
  BalanceRelationsResolver,
  FindUniqueCurrencyRateResolver,
  FindFirstCurrencyRateResolver,
  FindManyCurrencyRateResolver,
  AggregateCurrencyRateResolver,
  GroupByCurrencyRateResolver,
  FindUniqueBadgeItemLikeResolver,
  FindFirstBadgeItemLikeResolver,
  FindManyBadgeItemLikeResolver,
  AggregateBadgeItemLikeResolver,
  GroupByBadgeItemLikeResolver,
  FindUniqueBadgeTypeLikeResolver,
  FindFirstBadgeTypeLikeResolver,
  FindManyBadgeTypeLikeResolver,
  AggregateBadgeTypeLikeResolver,
  GroupByBadgeTypeLikeResolver,
  FindUniqueBadgeItemViewResolver,
  FindFirstBadgeItemViewResolver,
  FindManyBadgeItemViewResolver,
  AggregateBadgeItemViewResolver,
  GroupByBadgeItemViewResolver,
  FindUniqueBadgeTypeViewResolver,
  FindFirstBadgeTypeViewResolver,
  FindManyBadgeTypeViewResolver,
  AggregateBadgeTypeViewResolver,
  GroupByBadgeTypeViewResolver,
  FindUniqueFollowResolver,
  FindFirstFollowResolver,
  FindManyFollowResolver,
  AggregateFollowResolver,
  GroupByFollowResolver,
  FindUniqueNotificationResolver,
  FindFirstNotificationResolver,
  FindManyNotificationResolver,
  AggregateNotificationResolver,
  GroupByNotificationResolver,
} from '@generated/type-graphql'
import { UserType } from '@prisma/client'

const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  Profile: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  BadgeType: {
    //  publicly available
    // todo: we need a custom query instead for public use, because of relation ships
  },
  BadgeItem: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  Cause: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  Stripe: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  Balance: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  CurrencyRate: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  BadgeItemLike: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  BadgeTypeLike: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  BadgeItemView: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  BadgeTypeView: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  Follow: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  Notification: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
}

applyResolversEnhanceMap(resolversEnhanceMap)

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

const badgeItemResolvers = [
  FindUniqueBadgeItemResolver,
  FindFirstBadgeItemResolver,
  FindManyBadgeItemResolver,
  AggregateBadgeItemResolver,
  GroupByBadgeItemResolver,
  BadgeItemRelationsResolver,
]

const causeResolvers = [
  FindUniqueCauseResolver,
  FindFirstCauseResolver,
  FindManyCauseResolver,
  AggregateCauseResolver,
  GroupByCauseResolver,
  CauseRelationsResolver,
]

const stripeResolvers = [
  FindUniqueStripeResolver,
  FindFirstStripeResolver,
  FindManyStripeResolver,
  AggregateStripeResolver,
  GroupByStripeResolver,
  StripeRelationsResolver,
]

const balanceResolvers = [
  FindUniqueBalanceResolver,
  FindFirstBalanceResolver,
  FindManyBalanceResolver,
  AggregateBalanceResolver,
  GroupByBalanceResolver,
  BalanceRelationsResolver,
]

const currencyRateResolvers = [
  FindUniqueCurrencyRateResolver,
  FindFirstCurrencyRateResolver,
  FindManyCurrencyRateResolver,
  AggregateCurrencyRateResolver,
  GroupByCurrencyRateResolver,
]

const badgeItemLikeResolvers = [
  FindUniqueBadgeItemLikeResolver,
  FindFirstBadgeItemLikeResolver,
  FindManyBadgeItemLikeResolver,
  AggregateBadgeItemLikeResolver,
  GroupByBadgeItemLikeResolver,
]

const badgeTypeLikeResolvers = [
  FindUniqueBadgeTypeLikeResolver,
  FindFirstBadgeTypeLikeResolver,
  FindManyBadgeTypeLikeResolver,
  AggregateBadgeTypeLikeResolver,
  GroupByBadgeTypeLikeResolver,
]

const badgeItemViewResolvers = [
  FindUniqueBadgeItemViewResolver,
  FindFirstBadgeItemViewResolver,
  FindManyBadgeItemViewResolver,
  AggregateBadgeItemViewResolver,
  GroupByBadgeItemViewResolver,
]

const badgeTypeViewResolvers = [
  FindUniqueBadgeTypeViewResolver,
  FindFirstBadgeTypeViewResolver,
  FindManyBadgeTypeViewResolver,
  AggregateBadgeTypeViewResolver,
  GroupByBadgeTypeViewResolver,
]

const followResolvers = [
  FindUniqueFollowResolver,
  FindFirstFollowResolver,
  FindManyFollowResolver,
  AggregateFollowResolver,
  GroupByFollowResolver,
]

const notificationResolvers = [
  FindUniqueNotificationResolver,
  FindFirstNotificationResolver,
  FindManyNotificationResolver,
  AggregateNotificationResolver,
  GroupByNotificationResolver,
]

export const generatedResolvers = [
  ...userResolvers,
  ...profileResolvers,
  ...badgeTypeResolvers,
  ...badgeItemResolvers,
  ...causeResolvers,
  ...stripeResolvers,
  ...balanceResolvers,
  ...currencyRateResolvers,
  ...badgeItemLikeResolvers,
  ...badgeTypeLikeResolvers,
  ...badgeItemViewResolvers,
  ...badgeTypeViewResolvers,
  ...followResolvers,
  ...notificationResolvers
]
