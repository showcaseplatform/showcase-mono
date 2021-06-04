import { Resolver, Ctx, Mutation, Arg } from 'type-graphql'
import { AddCardInput } from '../libs/payment/types/addCard.type'
import { createStripeCustomer } from '../libs/payment/createStripeCustomer'
import { CreateCryptoWalletInput } from '../libs/payment/types/createCryptoWallet.type'
import { createCryptoWallet } from '../libs/payment/createCryptoWallet'
import { createTransferwiseAccount } from '../libs/payment/createTransferwiseAccount'
import { PayoutAccountInput } from '../libs/payment/types/payoutAccount.type'
import { withdrawFromTransferwise } from '../libs/payment/withdrawFromTransferwise'
import { WithdrawFromTransferwiseInput } from '../libs/payment/types/withdrawFromTransferwise.type'

@Resolver()
export class PaymentResolver {

  @Mutation((_returns) => String)
  async createStripeCustomer(@Arg('data') input: AddCardInput, @Ctx() ctx: any) {
    return await createStripeCustomer(input, ctx.user)
  }

  @Mutation((_returns) => String)
  async createCryptoWallet(@Arg('data') input: CreateCryptoWalletInput, @Ctx() ctx: any) {
    return await createCryptoWallet(input, ctx.user)
  }

  @Mutation((_returns) => String)
  async createTransferwiseAccount(@Arg('data') input: PayoutAccountInput, @Ctx() ctx: any) {
    return await createTransferwiseAccount(input, ctx.user)
  }

  @Mutation((_returns) => String)
  async withdrawFromTransferwise(@Arg('data') input: WithdrawFromTransferwiseInput, @Ctx() ctx: any) {
    return await withdrawFromTransferwise(input, ctx.user)
  }




  


}
