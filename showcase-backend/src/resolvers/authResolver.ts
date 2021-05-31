
import { Mutation, Arg, Resolver } from 'type-graphql';
import { sendPhoneCode } from '../libs/auth/sendPhoneCode';
import { SendPhoneCodeInput, SendPhoneCodeResponse } from '../libs/auth/types/sendPhoneCode.type';
import { VerifyPhoneCodeInput, VerifyPhoneCodeResponse } from '../libs/auth/types/verifyPhoneCode.type';
import { verifyPhoneCode } from '../libs/auth/verifyPhoneCode';

@Resolver()
export class AuthResolver {

  @Mutation((_returns) => SendPhoneCodeResponse)
  async sendPhoneCode(@Arg('data') input: SendPhoneCodeInput) {
    return await sendPhoneCode(input)
  }
  
  @Mutation((_returns) => VerifyPhoneCodeResponse)
  async verifyPhoneCode(@Arg('data') input: VerifyPhoneCodeInput) {
    return await verifyPhoneCode(input)
  }
}