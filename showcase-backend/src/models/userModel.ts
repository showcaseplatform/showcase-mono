import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Chat } from '../types/chat';

import { Currency, NotificationToken, Uid } from '../types/user';
import { Notification } from './notifcationModel';

@ObjectType({ description: "The notifcation model" })
export class User {
    @Field(() => ID)
    uid: Uid
    @Field(() => Int)
    areaCode: number
    @Field()
    avatar?: string
    @Field(() => Int)
    badgesCount: number
    @Field()
    balances: {
      eur: number
      gbp: number
      usd: number
    }
    @Field()
    username: string
    @Field()
    currency: Currency
    @Field()
    displayName: string
    @Field(() => Int)
    followersCount: number
    @Field(() => Int)
    followingCount: number
    @Field()
    phoneLocal: string
    @Field()
    phoneNumber: string

    @Field(() => [Notification])
    notifications: Notification[]

    // todo: add remaining props
  }