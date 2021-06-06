import { InputType, Field, } from 'type-graphql'
import { Length } from 'class-validator'

@InputType({ description: 'Input data to connect user with stripe' })
export class CreateStripeCustomerInput {
  @Field()
  stripeToken: string

  @Field()
  @Length(4, 4)
  lastfour: string
}
