import { InputType, Field, } from 'type-graphql'
import { Length } from 'class-validator'

@InputType()
export class AddPaymentInfoInput {
  @Field()
  idToken: string

  @Field()
  @Length(4, 4)
  lastFourCardDigit: string
}
