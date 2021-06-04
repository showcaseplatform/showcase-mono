import { InputType, Field, } from 'type-graphql'

@InputType({ description: 'Input data to create crypto account' })
export class CreateCryptoWalletInput {
  @Field()
  password: string

  @Field()
  hint: string
}
