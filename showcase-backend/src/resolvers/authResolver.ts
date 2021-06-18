import { Mutation, Arg, Resolver, Query, Authorized, Ctx } from 'type-graphql'
import { smsLib } from '../libs/auth/smsLib'
import { SendPhoneCodeInput, SendPhoneCodeResponse } from '../libs/auth/types/sendPhoneCode.type'
import {
  VerifyPhoneCodeInput,
  VerifyPhoneCodeResponse,
} from '../libs/auth/types/verifyPhoneCode.type'
import { User } from '@generated/type-graphql'
import { UserType } from '.prisma/client'
import { CurrentUser } from '../libs/auth/decorators'

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

  @Authorized(UserType.basic, UserType.creator)
  @Query((_returns) => User)
  async me(@CurrentUser() currentUser: User) {
    return currentUser
  }
}
