import {
    Resolver,
    Ctx,
    Mutation,
    Arg,
  } from 'type-graphql'
  
import { toggleLike } from '../libs/badge/toggleLike'
import { ToggleLikeInput } from './types/toggleLikeInput'
import { countView } from '../libs/badge/countView'
import { CountViewInput } from './types/countViewInput'
  
  
  @Resolver()
  export class BadgeResolver {
    @Mutation(_returns => String)
    async toggleLike(
      @Ctx() ctx: any,
      @Arg('data') countLikeInput: ToggleLikeInput
    ): Promise<string> {
      await toggleLike(countLikeInput, ctx.user.id)
      return 'Ok'
    }
  
    @Mutation(_returns => String)
    async countView(
      @Ctx() ctx: any,
      @Arg('data') countViewInput: CountViewInput
    ): Promise<string> {
      await countView(countViewInput, ctx.user.id)
      return 'Ok'
    }
  }
  
  