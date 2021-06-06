import { Currency } from '@generated/type-graphql'
import { Min, Max } from 'class-validator'
import { InputType, Field, Float, } from 'type-graphql'
import { WITHDRAW_KYC_LIMIT, WITHDRAW_MIN_AMOUNT } from '../../../consts/businessRules'

@InputType({ description: 'Input data to create crypto account' })
export class WithdrawFromTransferwiseInput {

  @Field(_type => Currency)
  currency: Currency

  @Field(_type => Float)
  @Max(WITHDRAW_KYC_LIMIT)
  @Min(WITHDRAW_MIN_AMOUNT)
  amount: number
}
