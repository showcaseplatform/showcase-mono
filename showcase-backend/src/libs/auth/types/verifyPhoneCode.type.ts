import { User } from '@generated/type-graphql'
import { InputType, Field, ObjectType } from 'type-graphql'

@InputType({ description: 'Data for sending sms phone code' })
export class VerifyPhoneCodeInput {
  @Field()
  phone: string

  @Field()
  areaCode: string

  @Field()
  code: string
}

@ObjectType()
export class VerifyPhoneCodeResponse {
  @Field()
  isNewUser: boolean

  @Field()
  token: string

  @Field((_) => User)
  user: User
}
