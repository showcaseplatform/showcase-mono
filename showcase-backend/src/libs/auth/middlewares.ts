import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { MyContext } from '../../services/apollo'

export class IsOwnUser implements MiddlewareInterface<MyContext> {
  async use({ root, context }: ResolverData<MyContext>, next: NextFn) {
    const userId: string = context.user?.id || 'guest'
    const isOwnUser = userId === root.id
    if (isOwnUser) {
      return await next()
    } else {
      return null
    }
  }
}
export class FallbackToContextUser implements MiddlewareInterface<MyContext> {
  async use({ root, context, args }: ResolverData<MyContext>, next: NextFn) {
    console.log({ args }, {context}, {root})

    return await next()
  }
}
