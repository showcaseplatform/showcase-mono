import { Resolver, Ctx, Mutation, Arg, Authorized } from 'type-graphql'
import { CreateStripeCustomerInput } from '../libs/payment/types/createStripeCustomer.type'
import { createStripeCustomer } from '../libs/payment/createStripeCustomer'
import { CreateCryptoWalletInput } from '../libs/payment/types/createCryptoWallet.type'
import { createCryptoWallet } from '../libs/payment/createCryptoWallet'
import { createTransferwiseAccount } from '../libs/payment/createTransferwiseAccount'
import {
  EURAccount,
  GBPAccount,
  USDAccount,
} from '../libs/payment/types/payoutAccount.type'
import { withdrawFromTransferwise } from '../libs/payment/withdrawFromTransferwise'
import { WithdrawFromTransferwiseInput } from '../libs/payment/types/withdrawFromTransferwise.type'
import { UserType } from '@prisma/client'
import { GraphQLError } from 'graphql'

@Resolver()
export class PaymentResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async createStripeCustomer(@Arg('data') input: CreateStripeCustomerInput, @Ctx() ctx: any) {
    return await createStripeCustomer(input, ctx.user)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async createCryptoWallet(@Arg('data') input: CreateCryptoWalletInput, @Ctx() ctx: any) {
    return await createCryptoWallet(input, ctx.user)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async createTransferwiseAccount(
    @Ctx() ctx: any,
    @Arg('inputUSD', { nullable: true }) inputUSD?: USDAccount,
    @Arg('inputEUR', { nullable: true }) inputEUR?: EURAccount,
    @Arg('inputGBP', { nullable: true }) inputGBP?: GBPAccount
  ) {
    const input = inputUSD || inputEUR || inputGBP
    if (!input) throw new GraphQLError('Please provide an input data')
    return await createTransferwiseAccount(input, ctx.user)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async withdrawFromTransferwise(
    @Arg('data') input: WithdrawFromTransferwiseInput,
    @Ctx() ctx: any
  ) {
    return await withdrawFromTransferwise(input, ctx.user)
  }
}
