import { Resolver, Ctx, Mutation, Arg, Authorized } from 'type-graphql'
import { AddPaymentInfoInput } from '../libs/payment/types/createStripeCustomer.type'
import { addPaymentInfo } from '../libs/payment/addPaymentInfo'
import { CreateCryptoWalletInput } from '../libs/payment/types/createCryptoWallet.type'
import { createCryptoWallet } from '../libs/payment/createCryptoWallet'
import { createTransferwiseAccount } from '../libs/payment/createTransferwiseAccount'
import { EURAccount, GBPAccount, USDAccount } from '../libs/payment/types/payoutAccount.type'
import { withdrawFromTransferwise } from '../libs/payment/withdrawFromTransferwise'
import { WithdrawFromTransferwiseInput } from '../libs/payment/types/withdrawFromTransferwise.type'
import { User, UserType } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { CurrentUser } from '../libs/auth/decorators'

@Resolver()
export class PaymentResolver {
  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async addPaymentInfo(
    @Arg('data') input: AddPaymentInfoInput,
    @CurrentUser() currentUser: User
  ) {
    return await addPaymentInfo(input, currentUser)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async createCryptoWallet(
    @Arg('data') input: CreateCryptoWalletInput,
    @CurrentUser() currentUser: User
  ) {
    return await createCryptoWallet(input, currentUser)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async createTransferwiseAccount(
    @CurrentUser() currentUser: User,
    @Arg('inputUSD', { nullable: true }) inputUSD?: USDAccount,
    @Arg('inputEUR', { nullable: true }) inputEUR?: EURAccount,
    @Arg('inputGBP', { nullable: true }) inputGBP?: GBPAccount
  ) {
    const input = inputUSD || inputEUR || inputGBP
    if (!input) {
      throw new GraphQLError('Please provide an input data')
    }
    return await createTransferwiseAccount(input, currentUser)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => String)
  async withdrawFromTransferwise(
    @Arg('data') input: WithdrawFromTransferwiseInput,
    @CurrentUser() currentUser: User
  ) {
    return await withdrawFromTransferwise(input, currentUser)
  }
}
