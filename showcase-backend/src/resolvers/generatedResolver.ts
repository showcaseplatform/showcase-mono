import { Authorized, UseMiddleware } from 'type-graphql'

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
} from '@generated/type-graphql'
import { IsCurrentUser } from '../libs/auth/decorators'

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
      phone: [
        IsCurrentUser() as PropertyDecorator,
      ]
    }
  },
  Profile: {
    fields: {
      email: [
        IsCurrentUser() as PropertyDecorator,
      ],
    },
  },
 
});

applyRelationResolversEnhanceMap({
  User: {
    balance: [
      // UseMiddleware(isOwnedByCurrentUser),
      IsCurrentUser(null) as PropertyDecorator
    ],
    cryptoWallet: [
      IsCurrentUser(null) as PropertyDecorator
    ],
    transferwise: [
      IsCurrentUser(null) as PropertyDecorator
    ],
    withdrawals: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    stripeInfo: [
      IsCurrentUser(null) as PropertyDecorator
    ],
    buyReceipts: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    sellReceipts: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    notifications: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    notificationSettings: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    chats: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    sentChatMessages: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    chatMessageReads: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    friends: [
      IsCurrentUser([]) as PropertyDecorator
    ],
    followers: [
      IsCurrentUser([]) as PropertyDecorator
    ],
  },
})

// todo: make it work :)
// applyInputTypesEnhanceMap({
//   UserWhereUniqueInput: {
//     fields: {
//       id: [FallbackToCurrentUser() as PropertyDecorator],
//     },
//   },
// });

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

const followResolvers = [
  FollowRelationsResolver,
]

export const generatedResolvers = [
  ...userResolvers,
  ...profileResolvers,
  ...badgeTypeResolvers,
  ...causeResolvers,
  ...currencyRateResolvers,
  ...followResolvers
]

