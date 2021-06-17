import {
  NextFn,
  createParamDecorator,
  createMethodDecorator,
} from 'type-graphql'
import { MyContext } from '../../services/apollo'
import { BadgeType, User } from '@generated/type-graphql'

export const CurrentUser = () => {
  return createParamDecorator<MyContext>(({ context }) => {
    return context.user
  })
}

export const IsCurrentUser = () => {
  return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
    const rootUser = root as User
    const userId: string = context.user?.id || 'guest'
    const isOwnedByCurrentUser = userId === rootUser.id
    if (isOwnedByCurrentUser) {
      return await next()
    } else {
      return null
    }
  })
}

export const IsBadgeTypeCreatedByCurrentUser = () => {
  return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
    const rootBadgeType = root as BadgeType
    const userId: string = context.user?.id || 'guest'
    const isCreatedByCurrentUser = userId === rootBadgeType.creatorId
    if (isCreatedByCurrentUser) {
      return await next()
    } else {
      return null
    }
  })
}

// todo: same as IsCurrentUser but in a middleware, decide which to use in generatedResvoler.ts
// export class IsOwnUser implements MiddlewareInterface<MyContext> {
//   async use({ root, context }: ResolverData<MyContext>, next: NextFn) {
//     const userId: string = context.user?.id || 'guest'
//     console.log('IsOwnUser')
//     const isOwnUser = userId === root.id
//     if (isOwnUser) {
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
