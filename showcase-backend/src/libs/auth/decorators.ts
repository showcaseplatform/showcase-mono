import {
  NextFn,
  createParamDecorator,
  createMethodDecorator,
  MiddlewareInterface,
  ResolverData,
} from 'type-graphql'
import { MyContext } from '../../services/apollo'
import { BadgeType, User } from '@generated/type-graphql'

export const CurrentUser = () => {
  return createParamDecorator<MyContext>(({ context }) => {
    return context.user
  })
}

export const IsCurrentUser = (fallbackType? : null | []) => {
  return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
    const isOwnedByCurrentUser = context.user?.id && context.user.id === (root as User).id
    if (isOwnedByCurrentUser) {
      return await next()
    } else {
      return fallbackType || null
    }
  })
}

export const IsBadgeTypeCreatedByCurrentUser = (fallbackType? : null | []) => {
  return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
    const isCreatedByCurrentUser = context.user?.id && context.user.id === (root as BadgeType).creatorId
    if (isCreatedByCurrentUser) {
      return await next()
    } else {
      return fallbackType || null
    }
  })
}

// todo: same as IsCurrentUser but in a middleware, decide which to use in generatedResvoler.ts
// export class isOwnedByCurrentUser implements MiddlewareInterface<MyContext> {
//   async use({ root, context }: ResolverData<MyContext>, next: NextFn) {
//     const isOwnedByCurrentUser = context.user?.id && context.user.id === (root as User).id
//     console.log("isOwnedByCurrentUser")
//     if (isOwnedByCurrentUser) {
//       return await next()
//     } else {
//       return null
//     }
//   }
// }

// export const FallbackToCurrentUser = () => {
//   return createParamDecorator<MyContext>(({ context }) => {
//     console.log("FallbackToCurrentUser")
//     return context.user
//   })
// }

// export class FallbackToContextUser implements MiddlewareInterface<MyContext> {
//   use({ root, context, args }: ResolverData<MyContext>, next: NextFn) {
//     console.log({ args }, { context }, { root })
//     // todo: implement this
//     return next()
//   }
// }
