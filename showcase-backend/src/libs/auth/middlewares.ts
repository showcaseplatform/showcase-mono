import { createMethodDecorator, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { MyContext } from '../../services/apollo'
import { AuthLib } from './authLib'

// export const isOwnUser = () => createMethodDecorator(AuthLib.isOwnUser)
export class IsOwnUser implements MiddlewareInterface<MyContext> {
  async use({ root, context}: ResolverData<MyContext>, next: NextFn) {
    const userId: string = context.user?.id || 'guest'
    const isOwnUser = userId === root.id
    if(isOwnUser) {
      return await next()
    } else {
      return null
    }
  }
}
