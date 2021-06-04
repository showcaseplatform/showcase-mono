import { Resolver, Ctx, Mutation, Arg } from 'type-graphql'
import { AddCardInput } from '../libs/payment/types/addCard.type'
import { addCard } from '../libs/payment/addCard'
import { CreateCryptoWalletInput } from '../libs/payment/types/createCryptoWallet.type'
import { createCryptoWallet } from '../libs/payment/createCryptoWallet'
import { createTransferwiseAccount } from '../libs/payment/createTransferwiseAccount'
import { PayoutAccountInput } from '../libs/payment/types/payoutAccount.type'

@Resolver()
export class WalletResolver {

  @Mutation((_returns) => String)
  async addCard(@Arg('data') input: AddCardInput, @Ctx() ctx: any) {
    return await addCard(input, ctx.user)
  }

  @Mutation((_returns) => String)
  async createCryptoWallet(@Arg('data') input: CreateCryptoWalletInput, @Ctx() ctx: any) {
    return await createCryptoWallet(input, ctx.user)
  }

  @Mutation((_returns) => String)
  async payoutAccount(@Arg('data') input: PayoutAccountInput, @Ctx() ctx: any) {
    return await createTransferwiseAccount(input, ctx.user)
  }




  


}
