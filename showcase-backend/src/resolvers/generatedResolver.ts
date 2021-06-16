import { Authorized, UseMiddleware } from 'type-graphql'

import {
  ResolversEnhanceMap,
  applyResolversEnhanceMap,
  applyModelsEnhanceMap,
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
  BadgeItemViewRelationsResolver,
  BadgeTypeViewRelationsResolver,
  FollowRelationsResolver,
  NotificationRelationsResolver,
  FindUniqueChatResolver,
  FindFirstChatResolver,
  FindManyChatResolver,
  AggregateChatResolver,
  GroupByChatResolver,
  ChatRelationsResolver,
  FindUniqueChatMessageResolver,
  FindFirstChatMessageResolver,
  FindManyChatMessageResolver,
  AggregateChatMessageResolver,
  GroupByChatMessageResolver,
  ChatMessageRelationsResolver,
} from '@generated/type-graphql'
import { UserType } from '@prisma/client'
import { IsOwnUser } from '../libs/auth/middlewares'

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
  Chat: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
  ChatMessage: {
    _all: [Authorized(UserType.basic, UserType.creator)],
  },
}

applyResolversEnhanceMap(resolversEnhanceMap)

// for relationship fields: applyRelationResolversEnhanceMap()
applyModelsEnhanceMap({
  Profile: {
    fields: {
      email: [
        UseMiddleware(IsOwnUser),
      ],
    },
  },
});

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
  BadgeItemRelationsResolver,
]

const badgeTypeLikeResolvers = [
  FindUniqueBadgeTypeLikeResolver,
  FindFirstBadgeTypeLikeResolver,
  FindManyBadgeTypeLikeResolver,
  AggregateBadgeTypeLikeResolver,
  GroupByBadgeTypeLikeResolver,
  BadgeTypeRelationsResolver,
]

const badgeItemViewResolvers = [
  FindUniqueBadgeItemViewResolver,
  FindFirstBadgeItemViewResolver,
  FindManyBadgeItemViewResolver,
  AggregateBadgeItemViewResolver,
  GroupByBadgeItemViewResolver,
  BadgeItemViewRelationsResolver
]

const badgeTypeViewResolvers = [
  FindUniqueBadgeTypeViewResolver,
  FindFirstBadgeTypeViewResolver,
  FindManyBadgeTypeViewResolver,
  AggregateBadgeTypeViewResolver,
  GroupByBadgeTypeViewResolver,
  BadgeTypeViewRelationsResolver,
]

const followResolvers = [
  FindUniqueFollowResolver,
  FindFirstFollowResolver,
  FindManyFollowResolver,
  AggregateFollowResolver,
  GroupByFollowResolver,
  FollowRelationsResolver,
]

const notificationResolvers = [
  FindUniqueNotificationResolver,
  FindFirstNotificationResolver,
  FindManyNotificationResolver,
  AggregateNotificationResolver,
  GroupByNotificationResolver,
  NotificationRelationsResolver,
]

const chatResolvers = [
  FindUniqueChatResolver,
  FindFirstChatResolver,
  FindManyChatResolver,
  AggregateChatResolver,
  GroupByChatResolver,
  ChatRelationsResolver,
]

const chatMessageResolvers = [
  FindUniqueChatMessageResolver,
  FindFirstChatMessageResolver,
  FindManyChatMessageResolver,
  AggregateChatMessageResolver,
  GroupByChatMessageResolver,
  ChatMessageRelationsResolver,
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
  ...notificationResolvers,
  ...chatResolvers,
  ...chatMessageResolvers
]

