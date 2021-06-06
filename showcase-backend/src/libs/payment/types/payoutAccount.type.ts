import { Currency } from '@generated/type-graphql'
import { InputType, Field } from 'type-graphql'
@InputType({ description: 'Input data to create transferwise account' })
export class TransferwiseAccountBaseInput {
  @Field()
  currency: Currency

  @Field()
  accountHolderName: string

  @Field()
  accountNumber: string
}

@InputType()
export class EURAccount extends TransferwiseAccountBaseInput {
  @Field()
  iban: string
}
@InputType()
export class USDAccount extends TransferwiseAccountBaseInput {
  @Field()
  routingNumber: string

  @Field()
  accountType: string

  @Field()
  city: string

  @Field()
  firstLine: string

  @Field()
  postCode: string

  @Field()
  country: string
}
@InputType()
export class GBPAccount extends TransferwiseAccountBaseInput {

  @Field()
  sortCode: string
}