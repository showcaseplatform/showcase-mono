import { InputType, Field, ObjectType } from 'type-graphql'

@InputType({ description: 'Data for sending sms phone code' })
export class SendPhoneCodeInput {
  @Field()
  phone: string

  @Field()
  areaCode: string
}

@ObjectType()
export class SendPhoneCodeResponse {
  @Field()
  success: boolean;
}
