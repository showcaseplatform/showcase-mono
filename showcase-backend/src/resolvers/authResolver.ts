import { Mutation, Arg, Resolver } from 'type-graphql'
import { smsLib } from '../libs/auth/smsLib'
import { SendPhoneCodeInput, SendPhoneCodeResponse } from '../libs/auth/types/sendPhoneCode.type'
import {
  VerifyPhoneCodeInput,
  VerifyPhoneCodeResponse,
} from '../libs/auth/types/verifyPhoneCode.type'

@Resolver()
export class AuthResolver {
  @Mutation((_returns) => SendPhoneCodeResponse)
  async sendPhoneCode(@Arg('data') input: SendPhoneCodeInput) {
    return await smsLib.sendPhoneCode(input)
  }

  @Mutation((_returns) => VerifyPhoneCodeResponse)
  async verifyPhoneCode(@Arg('data') input: VerifyPhoneCodeInput) {
    return await smsLib.verifyPhoneCode(input)
  }
}
