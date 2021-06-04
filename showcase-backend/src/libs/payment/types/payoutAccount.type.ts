import { Currency } from '@generated/type-graphql'
import { InputType, Field } from 'type-graphql'

@InputType({ description: 'Input data to create crypto account' })
export class PayoutAccountInput {
  @Field()
  currency: Currency

  @Field()
  accountHolderName: string

  @Field()
  accountNumber: string

  @Field({ nullable: true })
  routingNumber?: string

  @Field({ nullable: true })
  accountType?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  firstLine?: string

  @Field({ nullable: true })
  postCode?: string

  @Field({ nullable: true })
  country?: string

  @Field({ nullable: true })
  iban?: string

  @Field({ nullable: true })
  sortCode?: string
}
