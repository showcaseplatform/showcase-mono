import { Authorized } from 'type-graphql'

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
} from '@generated/type-graphql'
import { UserType } from '@prisma/client'
import { IsBadgeTypeCreatedByCurrentUser, IsCurrentUser } from '../libs/auth/decorators'

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
      IsCurrentUser() as PropertyDecorator
    ],
    cryptoWallet: [
      IsCurrentUser() as PropertyDecorator
    ],
    transferwise: [
      IsCurrentUser() as PropertyDecorator
    ],
    withdrawals: [
      IsCurrentUser() as PropertyDecorator
    ],
    stripeInfo: [
      IsCurrentUser() as PropertyDecorator
    ],
    buyReceipts: [
      IsCurrentUser() as PropertyDecorator
    ],
    sellReceipts: [
      IsCurrentUser() as PropertyDecorator
    ],
    notifications: [
      IsCurrentUser() as PropertyDecorator
    ],
    notificationSettings: [
      IsCurrentUser() as PropertyDecorator
    ],
    chats: [
      IsCurrentUser() as PropertyDecorator
    ],
    sentChatMessages: [
      IsCurrentUser() as PropertyDecorator
    ],
    chatMessageReads: [
      IsCurrentUser() as PropertyDecorator
    ],
    friends: [
      Authorized(UserType.basic, UserType.creator)
    ],
    followers: [
      Authorized(UserType.basic, UserType.creator)
    ],
    badgeTypesCreated: [
      Authorized(UserType.basic, UserType.creator)
    ],
    badgeTypesForResell: [
      Authorized(UserType.basic, UserType.creator)
    ],
    badgeItemsOwned: [ 
      Authorized(UserType.basic, UserType.creator)

    ],
    badgeItemsOriginatedFrom: [
      Authorized(UserType.basic, UserType.creator)
    ],

  },
  BadgeType: {
    receipts: [
      IsBadgeTypeCreatedByCurrentUser() as PropertyDecorator
    ]
  }
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



export const generatedResolvers = [
  ...userResolvers,
  ...profileResolvers,
  ...badgeTypeResolvers,
  ...causeResolvers,
  ...currencyRateResolvers,
]

